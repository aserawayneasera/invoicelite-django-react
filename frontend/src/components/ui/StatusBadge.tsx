import type { InvoiceStatus } from '../../types'
import clsx from 'clsx'

const styles: Record<InvoiceStatus, string> = {
  draft:   'bg-gray-100 text-gray-700',
  sent:    'bg-blue-100 text-blue-700',
  paid:    'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
}

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-medium capitalize', styles[status])}>
      {status}
    </span>
  )
}