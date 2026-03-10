import type { ReactNode } from 'react'
import { useFeatureGate } from '@/hooks/useFeatureGate'
import UpgradePrompt from './UpgradePrompt'

interface Props {
  feature: string
  children: ReactNode
  fallback?: ReactNode
}

function FeatureGate({ feature, children, fallback }: Props) {
  const { hasFeature } = useFeatureGate()

  if (hasFeature(feature)) {
    return <>{children}</>
  }

  if (fallback !== undefined) {
    return <>{fallback}</>
  }

  return <UpgradePrompt feature={feature} />
}

export default FeatureGate
