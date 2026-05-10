export interface User {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
}

export interface Client {
  id: number
  name: string
  email: string
  phone: string
  address: string
  invoice_count: number
  created_at: string
  updated_at: string
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'

export interface InvoiceItem {
  id: number
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
  subtotal: number
  tax_amount: number
  total: number
}

export interface Invoice {
  id: number
  client: number
  client_name: string
  invoice_number: string
  status: InvoiceStatus
  issue_date: string
  due_date: string | null
  notes: string
  items: InvoiceItem[]
  total_amount: number
  created_at: string
  updated_at: string
}

export interface Quote {
  id: number
  client: number
  client_name: string
  quote_number: string
  issue_date: string
  expiry_date: string | null
  notes: string
  converted: boolean
  items: InvoiceItem[]
  created_at: string
}

export interface DashboardSummary {
  total_invoices: number
  draft: number
  sent: number
  paid: number
  overdue: number
  total_paid: number
  total_unpaid: number
}