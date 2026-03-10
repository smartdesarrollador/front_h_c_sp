import { type ElementType, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, CreditCard, Wallet, Smartphone } from 'lucide-react'

const cardSchema = z.object({
  cardNumber: z
    .string()
    .min(19, 'Número de tarjeta inválido')
    .max(19, 'Número de tarjeta inválido'),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Formato MM/AA requerido'),
  cvv: z
    .string()
    .min(3, 'CVV inválido')
    .max(4, 'CVV inválido'),
  cardHolder: z.string().min(3, 'Nombre requerido'),
})

type CardFormData = z.infer<typeof cardSchema>

const localSchema = z.object({
  provider: z.enum(['yape', 'plin', 'nequi', 'daviplata']),
  phone: z.string().regex(/^\d{9}$/, 'Debe tener 9 dígitos'),
})

type LocalFormData = z.infer<typeof localSchema>

interface Props {
  isOpen: boolean
  onClose: () => void
  isPending: boolean
}

type TabId = 'card' | 'wallet' | 'local'

const TABS: { id: TabId; label: string; Icon: ElementType }[] = [
  { id: 'card',   label: 'Tarjeta',          Icon: CreditCard },
  { id: 'wallet', label: 'Billetera Digital', Icon: Wallet },
  { id: 'local',  label: 'Pago Local',        Icon: Smartphone },
]

export function AddPaymentMethodModal({ isOpen, onClose, isPending }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('card')

  const cardForm = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: { cardNumber: '', expiry: '', cvv: '', cardHolder: '' },
  })

  const localForm = useForm<LocalFormData>({
    resolver: zodResolver(localSchema),
    defaultValues: { provider: 'yape', phone: '' },
  })

  if (!isOpen) return null

  const handleCardSubmit = (data: CardFormData) => {
    console.info('Card submit', data)
    onClose()
  }

  const handleLocalSubmit = (data: LocalFormData) => {
    console.info('Local submit', data)
    onClose()
  }

  const handleWalletConnect = (provider: 'paypal' | 'mercadopago') => {
    console.info('Wallet connect', provider)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-method-modal-title"
        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2
            id="add-method-modal-title"
            className="text-base font-semibold text-gray-900"
          >
            Agregar método de pago
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div role="tablist" className="flex border-b border-gray-200">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={[
                'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors border-b-2',
                activeTab === id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700',
              ].join(' ')}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Tab: Tarjeta */}
          {activeTab === 'card' && (
            <form onSubmit={cardForm.handleSubmit(handleCardSubmit)} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Número de tarjeta
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  {...cardForm.register('cardNumber')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {cardForm.formState.errors.cardNumber && (
                  <p className="text-xs text-red-600 mt-1">
                    {cardForm.formState.errors.cardNumber.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Fecha de vencimiento
                  </label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    maxLength={5}
                    {...cardForm.register('expiry')}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {cardForm.formState.errors.expiry && (
                    <p className="text-xs text-red-600 mt-1">
                      {cardForm.formState.errors.expiry.message}
                    </p>
                  )}
                </div>
                <div className="w-24">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="CVV"
                    maxLength={4}
                    {...cardForm.register('cvv')}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {cardForm.formState.errors.cvv && (
                    <p className="text-xs text-red-600 mt-1">
                      {cardForm.formState.errors.cvv.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nombre del titular
                </label>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  {...cardForm.register('cardHolder')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {cardForm.formState.errors.cardHolder && (
                  <p className="text-xs text-red-600 mt-1">
                    {cardForm.formState.errors.cardHolder.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full mt-2 py-2 px-4 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? 'Agregando...' : 'Agregar tarjeta'}
              </button>
            </form>
          )}

          {/* Tab: Billetera Digital */}
          {activeTab === 'wallet' && (
            <div className="space-y-3">
              <button
                onClick={() => handleWalletConnect('paypal')}
                className="w-full flex items-center justify-between p-3 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all"
                style={{ backgroundColor: '#003087' }}
              >
                <span className="text-sm font-medium text-white">Conectar PayPal</span>
              </button>
              <button
                onClick={() => handleWalletConnect('mercadopago')}
                className="w-full flex items-center justify-between p-3 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all"
                style={{ backgroundColor: '#009EE3' }}
              >
                <span className="text-sm font-medium text-white">Conectar MercadoPago</span>
              </button>
            </div>
          )}

          {/* Tab: Pago Local */}
          {activeTab === 'local' && (
            <form onSubmit={localForm.handleSubmit(handleLocalSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Proveedor
                </label>
                <select
                  {...localForm.register('provider')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="yape">Yape</option>
                  <option value="plin">Plin</option>
                  <option value="nequi">Nequi</option>
                  <option value="daviplata">Daviplata</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Número de celular
                </label>
                <input
                  type="tel"
                  placeholder="999000000"
                  maxLength={9}
                  {...localForm.register('phone')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {localForm.formState.errors.phone && (
                  <p className="text-xs text-red-600 mt-1">
                    {localForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2 px-4 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? 'Conectando...' : 'Conectar'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
