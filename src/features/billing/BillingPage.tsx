import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePermissions } from '@/hooks/usePermissions'
import { usePaymentMethods } from './hooks/usePaymentMethods'
import { useAddPaymentMethod } from './hooks/useAddPaymentMethod'
import { PaymentMethodCard } from './components/PaymentMethodCard'
import { AddPaymentMethodModal } from './components/AddPaymentMethodModal'
import { InvoiceList } from './components/InvoiceList'

export default function BillingPage() {
  const { t } = useTranslation('hub')
  const { canManageBilling } = usePermissions()
  const { methods, isLoading: methodsLoading } = usePaymentMethods()
  const { isPending: adding } = useAddPaymentMethod()
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('billing.title', 'Métodos de Pago')}
        </h1>
        <p className="text-gray-500 mt-1">
          {t('billing.subtitle', 'Gestiona tus métodos de pago guardados')}
        </p>
      </div>

      {/* Access limited banner */}
      {!canManageBilling && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          Solo el Owner puede gestionar la facturación.
        </div>
      )}

      {/* Payment Methods section */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('billing.title', 'Métodos de pago')}
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            disabled={!canManageBilling}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('billing.addMethod', 'Agregar método')}
          </button>
        </div>

        {methodsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-gray-200 h-40 bg-gray-100"
              />
            ))}
          </div>
        ) : methods.length === 0 ? (
          <p className="text-gray-500 text-sm">
            {t('billing.noMethods', 'No tienes métodos de pago guardados.')}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {methods.map((m) => (
              <PaymentMethodCard key={m.id} method={m} canManage={canManageBilling} />
            ))}
          </div>
        )}
      </section>

      {/* Invoice history */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Historial de facturas</h2>
        <InvoiceList />
      </section>

      <AddPaymentMethodModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        isPending={adding}
      />
    </div>
  )
}
