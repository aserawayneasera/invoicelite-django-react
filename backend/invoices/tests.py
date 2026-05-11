import pytest
from django.utils import timezone
from clients.models import Client
from invoices.models import Invoice


@pytest.fixture
def client_obj(auth_client):
    _, user = auth_client
    return Client.objects.create(owner=user, name='Test Client')


@pytest.mark.django_db
def test_create_invoice(auth_client, client_obj):
    api_client, _ = auth_client
    response = api_client.post('/api/invoices/', {
        'client': client_obj.id,
        'invoice_number': 'INV-0001',
        'status': 'draft',
        'issue_date': '2025-01-01',
        'items': [
            {
                'description': 'Web development',
                'quantity': 10,
                'unit_price': 5000,
                'tax_rate': 10,
            }
        ]
    }, format='json')
    assert response.status_code == 201
    assert response.data['invoice_number'] == 'INV-0001'
    assert len(response.data['items']) == 1


@pytest.mark.django_db
def test_invoice_summary(auth_client, client_obj):
    api_client, user = auth_client
    Invoice.objects.create(
        owner=user, client=client_obj,
        invoice_number='INV-001', status='paid',
        issue_date=timezone.now().date()
    )
    Invoice.objects.create(
        owner=user, client=client_obj,
        invoice_number='INV-002', status='sent',
        issue_date=timezone.now().date()
    )
    response = api_client.get('/api/invoices/summary/')
    assert response.status_code == 200
    assert response.data['total_invoices'] == 2
    assert response.data['paid'] == 1
    assert response.data['sent'] == 1


@pytest.mark.django_db
def test_invoice_status_filter(auth_client, client_obj):
    api_client, user = auth_client
    Invoice.objects.create(
        owner=user, client=client_obj,
        invoice_number='INV-001', status='draft',
        issue_date=timezone.now().date()
    )
    Invoice.objects.create(
        owner=user, client=client_obj,
        invoice_number='INV-002', status='paid',
        issue_date=timezone.now().date()
    )
    response = api_client.get('/api/invoices/?status=draft')
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]['status'] == 'draft'


@pytest.mark.django_db
def test_duplicate_invoice_number_rejected(auth_client, client_obj):
    api_client, user = auth_client
    Invoice.objects.create(
        owner=user, client=client_obj,
        invoice_number='INV-001', status='draft',
        issue_date=timezone.now().date()
    )
    response = api_client.post('/api/invoices/', {
        'client': client_obj.id,
        'invoice_number': 'INV-001',
        'status': 'draft',
        'issue_date': '2025-01-01',
        'items': []
    }, format='json')
    assert response.status_code == 400