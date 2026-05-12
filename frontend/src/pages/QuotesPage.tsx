import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import type { Quote, Client } from '../types'
import { Layout } from '../components/Layout'
import { Button } from '../components/ui/Button'
import { formatDate } from '../lib/utils'
import { Plus } from 'lucide-react'

export function QuotesPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [clientId, setClientId] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [notes, setNotes] = useState('')

  const { data: quotes = [], isLoading } = useQuery<Quote[]>({
    queryKey: ['quotes'],
    queryFn: () => api.get('/quotes/').then(r => r.data),
  })

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: () => api.get('/clients/').then(r => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (data: object) => api.post('/quotes/', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['quotes'] })
      setShowForm(false)
      setClientId('')
      setExpiryDate('')
      setNotes('')
    },
  })

  const convertMutation = useMutation({
    mutationFn: (id: number) => api.post(`/quotes/${id}/convert_to_invoice/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['quotes'] })
      qc.invalidateQueries({ queryKey: ['invoices'] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({
      client: parseInt(clientId),
      expiry_date: expiryDate || null,
      notes,
      items: [],
    })
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={16} className="inline mr-1" /> New Quote
        </Button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold mb-4">New Quote</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
            <select
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              required
            >
              <option value="">Select client *</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              type="date"
              placeholder="Expiry date"
              value={expiryDate}
              onChange={e => setExpiryDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="Notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <div className="col-span-3 flex gap-2">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-gray-500">Loading…</p>
        ) : quotes.length === 0 ? (
          <p className="p-6 text-gray-500">No quotes yet. Create one above.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Number</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Client</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Issued</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Expires</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {quotes.map(q => (
                <tr key={q.id}>
                  <td className="px-4 py-3 font-medium text-blue-600">{q.quote_number}</td>
                  <td className="px-4 py-3 text-gray-600">{q.client_name}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(q.issue_date)}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {q.expiry_date ? formatDate(q.expiry_date) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {q.converted ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Converted
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Open
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!q.converted && (
                      <Button
                        variant="secondary"
                        onClick={() => {
                          if (confirm('Convert this quote to an invoice?')) {
                            convertMutation.mutate(q.id)
                          }
                        }}
                      >
                        Convert to Invoice
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  )
}