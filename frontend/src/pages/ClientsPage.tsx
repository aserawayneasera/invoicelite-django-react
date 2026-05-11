import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import type { Client } from '../types'
import { Layout } from '../components/Layout'
import { Button } from '../components/ui/Button'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export function ClientsPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: () => api.get('/clients/').then(r => r.data),
  })
  const createMutation = useMutation({
    mutationFn: (data: Partial<Client>) => api.post('/clients/', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['clients'] }); resetForm() },
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<Client> & { id: number }) => api.patch(`/clients/${id}/`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['clients'] }); resetForm() },
  })
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/clients/${id}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  })
  const resetForm = () => { setShowForm(false); setEditing(null); setName(''); setEmail(''); setPhone('') }
  const openEdit = (c: Client) => { setEditing(c); setName(c.name); setEmail(c.email); setPhone(c.phone); setShowForm(true) }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) { updateMutation.mutate({ id: editing.id, name, email, phone }) }
    else { createMutation.mutate({ name, email, phone }) }
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <Button onClick={() => setShowForm(true)}><Plus size={16} className="inline mr-1" /> New Client</Button>
      </div>
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold mb-4">{editing ? 'Edit Client' : 'New Client'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
            <input placeholder="Name *" value={name} onChange={e => setName(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" required />
            <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <div className="col-span-3 flex gap-2">
              <Button type="submit">Save</Button>
              <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? <p className="p-6 text-gray-500">Loading…</p>
        : clients.length === 0 ? <p className="p-6 text-gray-500">No clients yet.</p>
        : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Invoices</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map(c => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-medium"><Link to={`/clients/${c.id}`} className="text-blue-600 hover:underline">{c.name}</Link></td>
                  <td className="px-4 py-3 text-gray-500">{c.email}</td>
                  <td className="px-4 py-3 text-gray-500">{c.invoice_count}</td>
                  <td className="px-4 py-3 flex gap-2 justify-end">
                    <button onClick={() => openEdit(c)} className="text-gray-400 hover:text-gray-700"><Pencil size={14} /></button>
                    <button onClick={() => { if (confirm('Delete this client?')) deleteMutation.mutate(c.id) }} className="text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
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
