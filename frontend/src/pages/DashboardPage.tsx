import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import type { DashboardSummary } from '../types'
import { Layout } from '../components/Layout'

export function DashboardPage() {
  const { data, isLoading } = useQuery<DashboardSummary>({
    queryKey: ['invoice-summary'],
    queryFn: () => api.get('/invoices/summary/').then(r => r.data),
  })

  const stats = [
    { label: 'Total Invoices', value: data?.total_invoices ?? 0, color: 'text-gray-900' },
    { label: 'Draft',          value: data?.draft ?? 0,          color: 'text-gray-500' },
    { label: 'Sent',           value: data?.sent ?? 0,           color: 'text-blue-600' },
    { label: 'Paid',           value: data?.paid ?? 0,           color: 'text-green-600' },
    { label: 'Overdue',        value: data?.overdue ?? 0,        color: 'text-red-600' },
  ]

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      {isLoading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500">{label}</p>
              <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
