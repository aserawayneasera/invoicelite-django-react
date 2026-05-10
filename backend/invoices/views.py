from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Q
from django.utils import timezone
from .models import Invoice, Quote, Payment
from .serializers import InvoiceSerializer, QuoteSerializer, PaymentSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Invoice.objects.filter(owner=self.request.user).select_related('client')
        status_filter = self.request.query_params.get('status')
        search = self.request.query_params.get('search')
        if status_filter:
            qs = qs.filter(status=status_filter)
        if search:
            qs = qs.filter(
                Q(client__name__icontains=search) |
                Q(invoice_number__icontains=search)
            )
        return qs

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        invoice = self.get_object()
        invoice.status = Invoice.STATUS_PAID
        invoice.save()
        return Response({'status': 'Invoice marked as paid'})

    @action(detail=True, methods=['post'])
    def mark_sent(self, request, pk=None):
        invoice = self.get_object()
        invoice.status = Invoice.STATUS_SENT
        invoice.save()
        return Response({'status': 'Invoice marked as sent'})

    @action(detail=False, methods=['get'])
    def summary(self, request):
        qs = Invoice.objects.filter(owner=request.user)
        data = {
            'total_invoices': qs.count(),
            'draft': qs.filter(status='draft').count(),
            'sent': qs.filter(status='sent').count(),
            'paid': qs.filter(status='paid').count(),
            'overdue': qs.filter(status='overdue').count(),
            'total_paid': qs.filter(status='paid').aggregate(
                s=Sum('items__unit_price')
            )['s'] or 0,
            'total_unpaid': qs.filter(
                status__in=['sent', 'overdue']
            ).count(),
        }
        return Response(data)


class QuoteViewSet(viewsets.ModelViewSet):
    serializer_class = QuoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Quote.objects.filter(owner=self.request.user).select_related('client')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'])
    def convert_to_invoice(self, request, pk=None):
        quote = self.get_object()
        if quote.converted:
            return Response(
                {'error': 'Quote already converted'},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Generate invoice number
        last_invoice = Invoice.objects.filter(
            owner=request.user
        ).order_by('-id').first()
        next_num = (last_invoice.id + 1) if last_invoice else 1
        invoice_number = f"INV-{next_num:04d}"

        invoice = Invoice.objects.create(
            owner=request.user,
            client=quote.client,
            quote=quote,
            invoice_number=invoice_number,
            status=Invoice.STATUS_DRAFT,
            issue_date=timezone.now().date(),
        )
        for item in quote.items.all():
            invoice.items.create(
                description=item.description,
                quantity=item.quantity,
                unit_price=item.unit_price,
                tax_rate=item.tax_rate,
            )
        quote.converted = True
        quote.save()
        serializer = InvoiceSerializer(invoice)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(invoice__owner=self.request.user)