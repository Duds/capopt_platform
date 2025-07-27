/**
 * Theme Provider Component - Application Theme Management
 * 
 * Provides theme management for the CapOpt Platform:
 * - Light and dark theme support
 * - Theme persistence across sessions
 * - System theme detection
 * - Theme switching capabilities
 * - Integration with next-themes library
 * - Context-based theme distribution
 * 
 * This component enables consistent theming across
 * the entire platform interface.
 */

'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
