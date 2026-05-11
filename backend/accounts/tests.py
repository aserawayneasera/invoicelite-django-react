import pytest


@pytest.mark.django_db
def test_register_user(client):
    response = client.post('/api/auth/register/', {
        'email': 'new@test.com',
        'username': 'newuser',
        'password': 'password123',
    }, content_type='application/json')
    assert response.status_code == 201
    assert response.data['email'] == 'new@test.com'


@pytest.mark.django_db
def test_login_returns_tokens(client, user):
    response = client.post('/api/auth/token/', {
        'email': 'test@test.com',
        'password': 'password123',
    }, content_type='application/json')
    assert response.status_code == 200
    assert 'access' in response.data
    assert 'refresh' in response.data


@pytest.mark.django_db
def test_login_wrong_password(client, user):
    response = client.post('/api/auth/token/', {
        'email': 'test@test.com',
        'password': 'wrongpassword',
    }, content_type='application/json')
    assert response.status_code == 401


@pytest.mark.django_db
def test_me_endpoint_requires_auth(client):
    response = client.get('/api/auth/me/')
    assert response.status_code == 401


@pytest.mark.django_db
def test_me_endpoint_returns_user(auth_client):
    api_client, user = auth_client
    response = api_client.get('/api/auth/me/')
    assert response.status_code == 200
    assert response.data['email'] == user.email