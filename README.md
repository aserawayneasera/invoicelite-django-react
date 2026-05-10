# InvoiceLite

A lightweight billing SaaS application for managing clients, quotes, invoices,
and payment records. Built to demonstrate full-stack engineering with
Django, React, TypeScript, and PostgreSQL.

## Live Demo

- Frontend: [https://invoicelite.vercel.app](...)
- API: [https://invoicelite-api.onrender.com](...)
- Test login: `demo@invoicelite.com` / `demopassword`

## Tech Stack

| Layer    | Technology                                   |
|----------|----------------------------------------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS     |
| Backend  | Django 5, Django REST Framework, PostgreSQL  |
| Auth     | JWT (djangorestframework-simplejwt)          |
| Testing  | pytest-django (backend), Cypress (frontend)  |
| Deploy   | Vercel (frontend), Render (backend + DB)     |

## Features

- User registration and JWT authentication
- Client CRUD (create, read, update, delete)
- Quote creation with line items
- Quote → Invoice conversion
- Invoice status tracking: Draft / Sent / Paid / Overdue
- Invoice search and filtering
- Dashboard with invoice summary stats
- Payment records
- Backend API tests
- Frontend end-to-end tests

## Local Development

### Backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # edit if needed
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Tests

Backend:
```bash
cd backend && pytest -v
```

Frontend (requires both servers running):
```bash
cd frontend && npx cypress run
```

## API Endpoints

| Method | Endpoint                          | Description           |
|--------|-----------------------------------|-----------------------|
| POST   | /api/auth/register/               | Register new user     |
| POST   | /api/auth/token/                  | Login (get JWT)       |
| GET    | /api/clients/                     | List clients          |
| POST   | /api/clients/                     | Create client         |
| GET    | /api/invoices/                    | List invoices         |
| POST   | /api/invoices/                    | Create invoice        |
| POST   | /api/invoices/{id}/mark_paid/     | Mark invoice as paid  |
| GET    | /api/invoices/summary/            | Dashboard stats       |
| POST   | /api/quotes/{id}/convert_to_invoice/ | Convert quote      |

## Database Schema

```
User ──< Client ──< Invoice ──< InvoiceItem
                ──< Quote   ──< QuoteItem
          Invoice ──< Payment
```
