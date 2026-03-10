import type { BillingCycle } from '../types'

interface Props {
  value: BillingCycle
  onChange: (cycle: BillingCycle) => void
}

export default function BillingCycleToggle({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange('monthly')}
        aria-pressed={value === 'monthly'}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          value === 'monthly'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Mensual
      </button>
      <button
        onClick={() => onChange('annual')}
        aria-pressed={value === 'annual'}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
          value === 'annual'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Anual
        <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full font-semibold">
          -10% descuento
        </span>
      </button>
    </div>
  )
}
