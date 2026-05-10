from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from .models import Client
from .serializers import ClientSerializer


class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Client.objects.filter(owner=self.request.user).annotate(
            invoice_count=Count('invoices')
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)