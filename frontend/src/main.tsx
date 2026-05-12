import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { ClientsPage } from './pages/ClientsPage'
import { InvoicesPage } from './pages/InvoicesPage'
import './index.css'
import { QuotesPage } from './pages/QuotesPage'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {/* // Add inside <Routes>: */}
            <Route path="/quotes" element={<QuotesPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
)