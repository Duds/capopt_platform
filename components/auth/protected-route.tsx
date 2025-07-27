/**
 * Protected Route Component - Authentication and Authorization Wrapper
 * 
 * Provides route protection and access control for the CapOpt Platform:
 * - Authentication verification and redirect handling
 * - Role-based access control with required roles
 * - Loading states during authentication checks
 * - Fallback content for unauthorized access
 * - Automatic redirect to login for unauthenticated users
 * - Access denied messaging for insufficient permissions
 * 
 * This component wraps pages and features that require authentication
 * and specific role permissions within the platform.
 */

'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
  fallback?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  fallback 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  // Show fallback if user is not authenticated
  if (!user) {
    return fallback || null
  }

  // Check role requirements
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 