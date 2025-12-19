'use client'

import { useState } from 'react'
import { useTenant } from '@/lib/providers/TenantProvider'
import Image from 'next/image'

interface TenantLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
}

const sizeClasses = {
  sm: { container: 'h-8 w-8', text: 'text-2xl', logoText: 'text-sm' },
  md: { container: 'h-12 w-12', text: 'text-3xl', logoText: 'text-base' },
  lg: { container: 'h-16 w-16', text: 'text-4xl', logoText: 'text-lg' },
  xl: { container: 'h-24 w-24', text: 'text-6xl', logoText: 'text-2xl' },
}

export function TenantLogo({ size = 'md', className = '', showText = false }: TenantLogoProps) {
  const { tenant, logo, flag, tagline } = useTenant()
  const [imageError, setImageError] = useState(false)
  const sizes = sizeClasses[size]

  // If image fails to load, show styled text fallback
  if (imageError) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {/* Emoji fallback */}
        <div className={`${sizes.container} flex items-center justify-center`}>
          <span className={sizes.text}>{flag}</span>
        </div>

        {/* Text logo */}
        {showText && (
          <div className="flex flex-col">
            <span className={`${sizes.logoText} font-bold text-white`}>
              IA Factory
            </span>
            <span className="text-xs text-slate-400">{tagline}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Image logo with fallback */}
      <div className={`${sizes.container} relative`}>
        <Image
          src={logo}
          alt={`IA Factory ${tenant}`}
          fill
          className="object-contain"
          onError={() => setImageError(true)}
          priority
        />
      </div>

      {/* Optional text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${sizes.logoText} font-bold text-white`}>
            IA Factory
          </span>
          <span className="text-xs text-slate-400">{tagline}</span>
        </div>
      )}
    </div>
  )
}

// Simplified version for inline use
export function LogoIcon({ className = '' }: { className?: string }) {
  const { logo, flag } = useTenant()
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return <span className={`text-2xl ${className}`}>{flag}</span>
  }

  return (
    <div className={`h-8 w-8 relative ${className}`}>
      <Image
        src={logo}
        alt="IA Factory"
        fill
        className="object-contain"
        onError={() => setImageError(true)}
      />
    </div>
  )
}
