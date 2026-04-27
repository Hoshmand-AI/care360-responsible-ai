/**
 * Care360 AI Logo Component
 * 
 * Hoshmand AI Wordmark Pattern:
 * - Part 1: "Care" in DM Sans 700 (bold)
 * - Part 2: "360" in DM Serif Display 400 (accent color)
 * 
 * Usage:
 * <Logo />                    // Default (for light backgrounds)
 * <Logo variant="light" />    // For dark backgrounds (white text)
 * <Logo size="sm" />          // Smaller version
 */

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'default' | 'light'
  size?: 'sm' | 'default' | 'lg'
  className?: string
  asLink?: boolean
}

export function Logo({ 
  variant = 'default', 
  size = 'default',
  className,
  asLink = true 
}: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    default: 'text-2xl',
    lg: 'text-3xl',
  }

  const part1Classes = cn(
    'font-sans font-bold tracking-tight',
    variant === 'default' ? 'text-navy-950' : 'text-white'
  )

  const part2Classes = cn(
    'font-display font-normal',
    variant === 'default' ? 'text-teal-600' : 'text-teal-400'
  )

  const logoContent = (
    <span className={cn('inline-flex items-baseline', sizeClasses[size], className)}>
      <span className={part1Classes}>Care</span>
      <span className={part2Classes}>360</span>
    </span>
  )

  if (asLink) {
    return (
      <Link href="/" className="inline-flex items-baseline hover:opacity-90 transition-opacity">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

export default Logo
