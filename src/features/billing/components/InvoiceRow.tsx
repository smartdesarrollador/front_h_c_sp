import { Download } from 'lucide-react'
import type { Invoice, InvoiceStatus } from '../types'

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; className: string }> = {
  paid:          { label: 'Pagado',     className: 'bg-green-100 text-green-800' },
  open:          { label: 'Pendiente',  className: 'bg-yellow-100 text-yellow-800' },
  void:          { label: 'Anulado',    className: 'bg-gray-100 text-gray-700' },
  uncollectible: { label: 'Incobrable', className: 'bg-red-100 text-red-800' },
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatCurrency(amount: number, currency: string): string {
  return `${currency.toUpperCase()} ${amount.toFixed(2)}`
}

interface Props {
  invoice: Invoice
}

export function InvoiceRow({ invoice }: Props) {
  const badge = STATUS_CONFIG[invoice.status] ?? STATUS_CONFIG.open

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-900">{invoice.number}</td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {formatDate(invoice.period_start)} – {formatDate(invoice.period_end)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(invoice.created_at)}</td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
        {formatCurrency(invoice.amount, invoice.currency)}
      </td>
      <td className="px-4 py-3">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}>
          {badge.label}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        {invoice.pdf_url ? (
          <a
            href={invoice.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline"
            aria-label="Descargar PDF"
          >
            <Download className="h-3.5 w-3.5" />
            PDF
          </a>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>
    </tr>
  )
}
