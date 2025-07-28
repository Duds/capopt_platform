/**
 * Strategic Breadcrumbs Component - Hierarchical Navigation
 * 
 * Provides hierarchical navigation breadcrumbs for the CapOpt Platform:
 * - Enterprise to facility to business unit navigation
 * - Strategic layer context awareness
 * - Dynamic breadcrumb generation based on current location
 * - Clickable navigation between organizational levels
 * - Strategic navigation shortcuts
 * - Visual indicators for current context
 * - Integration with routing system
 * - Context-aware navigation suggestions
 * 
 * This component helps users understand their current location
 * within the organizational and strategic hierarchy.
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  ChevronRight,
  Building2,
  Factory,
  Users,
  Workflow,
  Target,
  Layers,
  Map,
  Network,
  BookOpen,
  FileText,
  CheckCircle,
  Clock,
  Archive
} from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useBusinessCanvas } from '@/hooks/use-business-canvas'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
  type: 'enterprise' | 'facility' | 'business-unit' | 'department' | 'page' | 'strategic' | 'business-canvas'
  status?: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED'
}

interface StrategicBreadcrumbsProps {
  className?: string
  showStrategic?: boolean
  activeLayer?: string
}

export function StrategicBreadcrumbs({ className = '', showStrategic = false, activeLayer }: StrategicBreadcrumbsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { businessCanvases } = useBusinessCanvas()
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const [isLoading, setIsLoading] = useState(true)



  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'REVIEW':
        return <Clock className="h-3 w-3 text-yellow-500" />
      case 'DRAFT':
        return <FileText className="h-3 w-3 text-blue-500" />
      case 'ARCHIVED':
        return <Archive className="h-3 w-3 text-gray-500" />
      default:
        return <FileText className="h-3 w-3 text-gray-500" />
    }
  }

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'REVIEW':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'DRAFT':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-600 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  useEffect(() => {
    const generateBreadcrumbs = () => {
      const items: BreadcrumbItem[] = []

      // Always start with enterprise
      items.push({
        label: 'Cracked Mountain Pty Ltd',
        href: '/',
        icon: <Building2 className="h-4 w-4" />,
        type: 'enterprise'
      })

      // Add facility
      items.push({
        label: 'Hercules Levee',
        href: '/facility/hercules-levee',
        icon: <Factory className="h-4 w-4" />,
        type: 'facility'
      })

      // Add business unit based on current page or active layer
      if (pathname.includes('/processes') || activeLayer === 'process-maps') {
        items.push({
          label: 'Processing Operations',
          href: '/business-unit/processing',
          icon: <Workflow className="h-4 w-4" />,
          type: 'business-unit'
        })
      } else if (pathname.includes('/controls') || activeLayer === 'critical-controls') {
        items.push({
          label: 'Safety & Health',
          href: '/business-unit/safety',
          icon: <Users className="h-4 w-4" />,
          type: 'business-unit'
        })
      } else if (pathname.includes('/assets')) {
        items.push({
          label: 'Maintenance',
          href: '/business-unit/maintenance',
          icon: <Workflow className="h-4 w-4" />,
          type: 'business-unit'
        })
      }

      // Add current page based on pathname or active layer
      if (pathname === '/' && !activeLayer) {
        items.push({
          label: 'Dashboard',
          type: 'page'
        })
      } else if (activeLayer === 'business-canvas') {
        items.push({
          label: 'Business Canvas',
          type: 'page'
        })
        
        // Add selected canvas hierarchy path
        const canvasId = searchParams.get('canvasId')
        
        if (canvasId) {
          // Build the full hierarchy path for the selected canvas
          const buildCanvasPath = (targetCanvasId: string): any[] => {
            const path: any[] = []
            let currentCanvasId = targetCanvasId
            
            // Build path from root to target
            while (currentCanvasId) {
              const canvas = businessCanvases.find(c => c.id === currentCanvasId)
              if (canvas) {
                path.unshift({
                  label: canvas.name,
                  type: 'business-canvas' as const,
                  status: canvas.status
                })
                currentCanvasId = canvas.parentCanvasId || ''
              } else {
                break
              }
            }
            
            return path
          }
          
          const canvasPath = buildCanvasPath(canvasId)
          items.push(...canvasPath)
        }
      } else if (activeLayer === 'critical-controls') {
        items.push({
          label: 'Critical Controls',
          type: 'page'
        })
      } else if (pathname.includes('/processes')) {
        if (pathname.includes('/processes/') && pathname.split('/').length > 2) {
          items.push({
            label: 'Processes',
            href: '/processes',
            type: 'page'
          })
          items.push({
            label: 'Process Detail',
            type: 'page'
          })
        } else {
          items.push({
            label: 'Processes',
            type: 'page'
          })
        }
      } else if (pathname.includes('/controls')) {
        items.push({
          label: 'Controls',
          type: 'page'
        })
      } else if (pathname.includes('/assets')) {
        items.push({
          label: 'Assets',
          type: 'page'
        })
      } else if (pathname.includes('/users')) {
        items.push({
          label: 'Users',
          type: 'page'
        })
      } else if (pathname.includes('/strategic')) {
        items.push({
          label: 'Strategic',
          type: 'page'
        })
      }

      // Add strategic navigation if enabled
      if (showStrategic && (pathname.includes('/processes') || activeLayer === 'process-maps')) {
        items.push({
          label: 'Strategic View',
          href: '/strategic/processes',
          icon: <Target className="h-4 w-4" />,
          type: 'strategic'
        })
      }

      setBreadcrumbs(items)
      setIsLoading(false)
    }

    generateBreadcrumbs()
  }, [pathname, searchParams, showStrategic, activeLayer, businessCanvases])

  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    if (item.href) {
      router.push(item.href)
    }
  }

  const getStrategicNavigationItems = () => [
    {
      label: 'Business Canvas',
      href: '/strategic',
      icon: <Layers className="h-4 w-4" />
    },
    {
      label: 'Operating Model',
      href: '/strategic/operating-model',
      icon: <Map className="h-4 w-4" />
    },
    {
      label: 'Value Chain',
      href: '/strategic/value-chain',
      icon: <Network className="h-4 w-4" />
    },
    {
      label: 'Service Model',
      href: '/strategic/service-model',
      icon: <BookOpen className="h-4 w-4" />
    }
  ]

  if (isLoading) {
    return (
      <nav className={`flex items-center space-x-1 text-sm ${className}`}>
        <div className="animate-pulse h-4 bg-gray-200 rounded w-32"></div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <div className="animate-pulse h-4 bg-gray-200 rounded w-24"></div>
      </nav>
    )
  }

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`}>
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />}
          
          {item.href ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-xs font-normal hover:bg-muted"
              onClick={() => handleBreadcrumbClick(item)}
            >
              {item.icon && <span className="mr-1">{item.icon}</span>}
              {item.label}
              {item.type === 'business-canvas' && item.status && (
                <Badge 
                  variant="outline" 
                  className={`ml-2 text-xs ${getStatusColor(item.status)}`}
                >
                  {getStatusIcon(item.status)}
                  <span className="ml-1">{item.status}</span>
                </Badge>
              )}
            </Button>
          ) : (
            <span className="flex items-center text-xs text-muted-foreground">
              {item.icon && <span className="mr-1">{item.icon}</span>}
              {item.label}
              {item.type === 'business-canvas' && item.status && (
                <Badge 
                  variant="outline" 
                  className={`ml-2 text-xs ${getStatusColor(item.status)}`}
                >
                  {getStatusIcon(item.status)}
                  <span className="ml-1">{item.status}</span>
                </Badge>
              )}
            </span>
          )}

          {/* Strategic Navigation Dropdown for strategic items */}
          {item.type === 'strategic' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-auto p-1 ml-1">
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {getStrategicNavigationItems().map((navItem) => (
                  <DropdownMenuItem
                    key={navItem.label}
                    onClick={() => router.push(navItem.href!)}
                  >
                    {navItem.icon}
                    <span className="ml-2">{navItem.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      ))}
    </nav>
  )
} 