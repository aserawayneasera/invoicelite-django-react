import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import type { Invoice, InvoiceStatus } from '../types'
import { Layout } from '../components/Layout'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Button } from '../components/ui/Button'
import { formatDate } from '../lib/utils'
import { Plus } from 'lucide-react'
import { Download } from 'lucide-react'

const STATUSES: InvoiceStatus[] = ['draft', 'sent', 'paid', 'overdue']

export function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | ''>('')
  const [search, setSearch] = useState('')

  const { data: invoices = [], isLoading } = useQuery<Invoice[]>({
    queryKey: ['invoices', statusFilter, search],
    queryFn: () => {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)
      if (search) params.set('search', search)
      return api.get(`/invoices/?${params}`).then(r => r.data)
    },
  })

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <Link to="/invoices/new"><Button><Plus size={16} className="inline mr-1" /> New Invoice</Button></Link>
      </div>
      <div className="flex gap-3 mb-4">
        <input placeholder="Search by client or number…" value={search} onChange={e => setSearch(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as InvoiceStatus | '')} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? <p className="p-6 text-gray-500">Loading…</p>
        : invoices.length === 0 ? <p className="p-6 text-gray-500">No invoices found.</p>
        : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Number</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Client</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td className="px-4 py-3"><Link to={`/invoices/${inv.id}`} className="text-blue-600 hover:underline font-medium">{inv.invoice_number}</Link></td>
                  <td className="px-4 py-3 text-gray-600">{inv.client_name}</td>
                  <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(inv.issue_date)}</td>
                  <td className="px-4 py-3 text-right font-medium">¥{Number(inv.total_amount).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  )
}

<td className="px-4 py-3">
  <div className="flex items-center gap-2">
    <Link to={`/invoices/${inv.id}`} className="text-blue-600 hover:underline font-medium">
      {inv.invoice_number}
    </Link>
    <a
      href={`${import.meta.env.VITE_API_URL}/invoices/${inv.id}/pdf/`}
      target="_blank"
      rel="noreferrer"
      className="text-gray-400 hover:text-blue-600"
      title="Download PDF"
    >
      <Download size={14} />
    </a>
  </div>
</td>
