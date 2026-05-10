from rest_framework import serializers
from .models import Client


class ClientSerializer(serializers.ModelSerializer):
    invoice_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Client
        fields = ['id', 'name', 'email', 'phone', 'address',
                  'invoice_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']