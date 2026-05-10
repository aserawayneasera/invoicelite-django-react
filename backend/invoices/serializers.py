from rest_framework import serializers
from .models import Invoice, InvoiceItem, Quote, QuoteItem, Payment


class InvoiceItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    tax_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = InvoiceItem
        fields = ['id', 'description', 'quantity', 'unit_price', 'tax_rate',
                  'subtotal', 'tax_amount', 'total']


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True)
    total_amount = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )
    client_name = serializers.CharField(source='client.name', read_only=True)

    class Meta:
        model = Invoice
        fields = ['id', 'client', 'client_name', 'quote', 'invoice_number',
                  'status', 'issue_date', 'due_date', 'notes',
                  'items', 'total_amount', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        invoice = Invoice.objects.create(**validated_data)
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item_data)
        return invoice

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if items_data is not None:
            instance.items.all().delete()
            for item_data in items_data:
                InvoiceItem.objects.create(invoice=instance, **item_data)
        return instance


class QuoteItemSerializer(serializers.ModelSerializer):
    total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = QuoteItem
        fields = ['id', 'description', 'quantity', 'unit_price', 'tax_rate', 'total']


class QuoteSerializer(serializers.ModelSerializer):
    items = QuoteItemSerializer(many=True)
    client_name = serializers.CharField(source='client.name', read_only=True)

    class Meta:
        model = Quote
        fields = ['id', 'client', 'client_name', 'quote_number', 'issue_date',
                  'expiry_date', 'notes', 'converted', 'items', 'created_at']
        read_only_fields = ['id', 'converted', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        quote = Quote.objects.create(**validated_data)
        for item_data in items_data:
            QuoteItem.objects.create(quote=quote, **item_data)
        return quote


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'invoice', 'amount', 'payment_date', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at']