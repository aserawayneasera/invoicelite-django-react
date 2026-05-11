# InvoiceLite

A full-stack invoicing SaaS application for managing clients and invoices — built with Django REST Framework, React, TypeScript, and PostgreSQL.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://invoicelite-django-react.vercel.app)
[![API](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render)](https://invoicelite-api.onrender.com)
[![Python](https://img.shields.io/badge/Python-Django-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)

---

## Live Demo

🌐 **Frontend:** https://invoicelite-django-react.vercel.app  
🔌 **API:** https://invoicelite-api.onrender.com  

**Test login:**
```
Email:    test@test.com
Password: password123
```

> ⚠️ The backend runs on Render's free tier — the first request may take 30–60 seconds to wake up.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Query, Axios |
| Backend | Python, Django 6, Django REST Framework |
| Auth | JWT (djangorestframework-simplejwt) — access + refresh tokens |
| Database | PostgreSQL, Django ORM |
| Deployment | Vercel (frontend), Render (backend + managed PostgreSQL) |

---

## Features

- ✅ User registration and JWT authentication
- ✅ Client management — create, edit, delete
- ✅ Invoice creation with line items
- ✅ Invoice status tracking: `draft` → `sent` → `paid` / `overdue`
- ✅ Invoice search and status filtering
- ✅ Dashboard with live invoice statistics
- ✅ CORS-secured API with environment-based configuration
- ✅ Fully deployed to production

---

## Architecture

```
invoicelite/
├── backend/                  # Django REST API
│   ├── accounts/             # User model + JWT auth endpoints
│   ├── clients/              # Client CRUD API
│   ├── invoices/             # Invoice + InvoiceItem API, summary endpoint
│   ├── config/               # Django settings, URLs
│   └── requirements.txt
├── frontend/                 # React + TypeScript SPA
│   ├── src/
│   │   ├── components/       # Layout, Button, StatusBadge
│   │   ├── contexts/         # AuthContext (JWT state)
│   │   ├── pages/            # Dashboard, Clients, Invoices, Login
│   │   ├── lib/              # Axios instance, utility functions
│   │   └── types/            # TypeScript interfaces for API responses
│   └── vite.config.ts
└── README.md
```

## Data Model

```
User ──< Client ──< Invoice ──< InvoiceItem
```

---

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL

### Backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgres://localhost/invoicelite_dev
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

```bash
createdb invoicelite_dev
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/`:
```
VITE_API_URL=http://localhost:8000/api
```

```bash
npm run dev
```

Visit http://localhost:5173

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register/` | No | Register new user |
| POST | `/api/auth/token/` | No | Login — returns JWT |
| GET | `/api/auth/me/` | Yes | Current user info |
| GET/POST | `/api/clients/` | Yes | List / create clients |
| GET/PATCH/DELETE | `/api/clients/{id}/` | Yes | Retrieve / update / delete client |
| GET/POST | `/api/invoices/` | Yes | List (filterable) / create invoices |
| GET/PATCH | `/api/invoices/{id}/` | Yes | Retrieve / update invoice |
| GET | `/api/invoices/summary/` | Yes | Dashboard stats |

---

## Key Technical Decisions

**Why Django REST Framework?**  
Batteries-included API framework — serializers, viewsets, authentication, and permissions in one place. Faster to build production-ready APIs than assembling separate libraries.

**Why JWT authentication?**  
Stateless — no server-side session storage. Access tokens are short-lived; refresh tokens are longer-lived. Scales horizontally and is the standard for APIs consumed by SPAs.

**Why React Query?**  
Handles loading/error states, caching, and automatic refetch after mutations. Eliminates repetitive `useEffect` + `useState` data-fetching boilerplate.

**Why separate Vercel + Render deployments?**  
Frontend and backend can be scaled, deployed, and updated independently. Vercel's CDN is optimised for static assets; Render handles Python/PostgreSQL well.

---

## What's Next

- [ ] PDF invoice export (WeasyPrint)
- [ ] Quote creation and quote → invoice conversion
- [ ] Automatic JWT token refresh
- [ ] pytest test coverage for all API endpoints
- [ ] Wagtail CMS help/FAQ section

---

## Author

**Asera Wayne Asera**  
PhD Student, Computer Science — Kumamoto University  
[GitHub](https://github.com/aserawayneasera) · [Email](mailto:asera.wa@gmail.com)
