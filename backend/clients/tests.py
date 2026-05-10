import pytest
from django.urls import reverse


@pytest.mark.django_db
def test_create_client(auth_client):
    client, user = auth_client
    response = client.post('/api/clients/', {
        'name': 'Acme Corp',
        'email': 'acme@example.com',
        'phone': '03-1234-5678',
    })
    assert response.status_code == 201
    assert response.data['name'] == 'Acme Corp'


@pytest.mark.django_db
def test_list_clients_only_own(auth_client):
    from django.contrib.auth import get_user_model
    from clients.models import Client
    client_api, user = auth_client
    User = get_user_model()

    other_user = User.objects.create_user(
        email='other@test.com', username='other', password='pass'
    )
    Client.objects.create(owner=other_user, name='Other Corp')
    Client.objects.create(owner=user, name='My Corp')

    response = client_api.get('/api/clients/')
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]['name'] == 'My Corp'


@pytest.mark.django_db
def test_delete_client(auth_client):
    from clients.models import Client
    client_api, user = auth_client
    c = Client.objects.create(owner=user, name='To Delete')
    response = client_api.delete(f'/api/clients/{c.id}/')
    assert response.status_code == 204