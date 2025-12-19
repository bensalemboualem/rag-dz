'use client'

import { useEffect } from 'react'
import { useTenant } from '@/lib/providers/TenantProvider'
import { updateFavicon } from '@/lib/utils/favicon'

export function DynamicFavicon() {
  const { tenant } = useTenant()

  useEffect(() => {
    // Update favicon when tenant changes
    updateFavicon(tenant)
  }, [tenant])

  return null // This component only manages side effects
}
