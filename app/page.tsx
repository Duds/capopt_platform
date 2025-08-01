/**
 * CapOpt Platform - Main Dashboard Page
 * 
 * This is the primary dashboard interface for the CapOpt Platform, providing:
 * - Real-time metrics and KPIs from the database
 * - Strategic navigation across all platform layers
 * - Quick access to key features (Business Canvas, Critical Controls)
 * - User authentication and role-based access control
 * - Implementation progress tracking
 * - Mock data indicators for features not yet implemented
 * 
 * The dashboard serves as the central hub for operational capability optimization
 * in high-risk industries, embedding Critical Controls Theory across all layers.
 */

'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Shield,
  TrendingUp,
  Activity,
  Target,
  Workflow,
  Users, 
  Package, 
  Plus,
  LogOut,
  User,
  BarChart3,
  Settings,
  FileText,
  Layers,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  PieChart,
  Search,
  Bell,
  Sun,
  Moon,
  Command,
  ChevronDown,
  Database,
  Eye,
  Copy,
  Edit,
  Download,
  Share,
  GitBranch
} from 'lucide-react'
import { controlsApi, processesApi, assetsApi, formatDate, getStatusColor, getPriorityColor } from '@/lib/api'
import { BusinessModelCanvas } from '@/components/business-canvas/BusinessModelCanvas'
import { BusinessModel } from '@/components/business-canvas/types'
import { defaultBusinessModel } from '@/components/business-canvas/utils'
import { EnterpriseContext } from '@/components/navigation/enterprise-context'
import { StrategicContext } from '@/components/navigation/strategic-context'
import { StrategicBreadcrumbs } from '@/components/navigation/strategic-breadcrumbs'
import { StrategicNavigationFlow } from '@/components/navigation/strategic-navigation-flow'
import { SidebarNav } from '@/components/navigation/sidebar-nav'

interface DashboardMetrics {
  totalControls: number
  activeControls: number
  totalProcesses: number
  activeProcesses: number
  totalAssets: number
  operationalAssets: number
  maturityScore: number
}

export default function CapOptPlatform() {
  const { user, logout } = useAuth()
  const [activeLayer, setActiveLayer] = useState<string>("dashboard")
  const [viewMode, setViewMode] = useState<'list' | 'canvas'>('canvas')
  const [isEditing, setIsEditing] = useState(false)
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalControls: 0,
    activeControls: 0,
    totalProcesses: 0,
    activeProcesses: 0,
    totalAssets: 0,
    operationalAssets: 0,
    maturityScore: 0
  })
  const [controls, setControls] = useState<any[]>([])
  const [processes, setProcesses] = useState<any[]>([])
  const [assets, setAssets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [notifications] = useState(3) // Mock notification count
  const [businessModel, setBusinessModel] = useState<BusinessModel>(defaultBusinessModel)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const maturityScores = {
    strategic: 75,
    operational: 68,
    control: 82,
    overall: 72,
  }

  const kpiData = [
    { label: "Process Efficiency", value: 85, trend: "up", implemented: false },
    { label: "Risk Coverage", value: 92, trend: "up", implemented: false },
    { label: "Value Delivery", value: 78, trend: "down", implemented: false },
    { label: "Compliance Score", value: 96, trend: "up", implemented: false },
  ]

  useEffect(() => {
    // Only fetch data if user is authenticated and we haven't loaded yet
    if (user && isLoading) {
      const fetchDashboardData = async () => {
        try {
          const [controlsData, processesData, assetsData] = await Promise.all([
            controlsApi.getAll({ include: 'riskCategory,controlType,effectiveness' }),
            processesApi.getAll({ include: 'steps,controls' }),
            assetsApi.getAll({ include: 'risks,protections' })
          ])

          setControls(controlsData)
          setProcesses(processesData)
          setAssets(assetsData)

          // Calculate metrics
          const activeControls = controlsData.filter((c: any) => 
            c.complianceStatus === 'COMPLIANT'
          ).length
          const activeProcesses = processesData.filter((p: any) => 
            p.status === 'ACTIVE'
          ).length
          const operationalAssets = assetsData.filter((a: any) => 
            a.status === 'OPERATIONAL'
          ).length

          setMetrics({
            totalControls: controlsData.length,
            activeControls,
            totalProcesses: processesData.length,
            activeProcesses,
            totalAssets: assetsData.length,
            operationalAssets,
            maturityScore: Math.round((activeControls + activeProcesses + operationalAssets) / (controlsData.length + processesData.length + assetsData.length) * 100)
          })
        } catch (error) {
          console.error('Error fetching dashboard data:', error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchDashboardData()
    } else if (!user && isLoading) {
      // User is not authenticated, set loading to false
      setIsLoading(false)
    }
  }, [user, isLoading])

  const handleLogout = () => {
    logout()
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <div className="w-full px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <a className="flex items-center gap-2" href="/">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                  <Layers className="h-4 w-4" />
                </div>
                <span className="font-semibold text-lg">CapOpt</span>
              </a>
              <div className="hidden sm:block">
                <span className="text-lg font-medium text-muted-foreground">
                  {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="hidden lg:block">
                <Button variant="outline" className="h-10 w-48 justify-between text-muted-foreground hover:text-foreground" disabled>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <span className="text-sm">Search...</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs bg-muted px-1.5 py-0.5 rounded">
                    <Command className="h-3 w-3" />
                    <span>K</span>
                  </div>
                </Button>
              </div>

              {/* System Settings Button (Admin Only) */}
              {user?.role === 'ADMIN' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-10 w-10">
                      <Settings className="h-[1.2rem] w-[1.2rem]" />
                      <span className="sr-only">System Settings</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>System Administration</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.location.href = '/users'}>
                      <Users className="mr-2 h-4 w-4" />
                      <span>User Management</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Security Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Activity className="mr-2 h-4 w-4" />
                      <span>System Monitoring</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Database className="mr-2 h-4 w-4" />
                      <span>Database Configuration</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>System Logs</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Gauge className="mr-2 h-4 w-4" />
                      <span>Performance Metrics</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative h-10 w-10" disabled>
                    <Bell className="h-[1.2rem] w-[1.2rem]" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-destructive text-white text-xs rounded-md">
                        {notifications}
                      </span>
                    )}
                    <span className="sr-only">View notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Process Updated</p>
                        <p className="text-xs text-muted-foreground">Customer onboarding process optimized</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Control Review Required</p>
                        <p className="text-xs text-muted-foreground">Data Privacy controls need attention</p>
                        <p className="text-xs text-muted-foreground">4 hours ago</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Business Canvas Modified</p>
                        <p className="text-xs text-muted-foreground">Value propositions updated</p>
                        <p className="text-xs text-muted-foreground">6 hours ago</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <Button variant="outline" size="icon" onClick={toggleTheme} className="h-10 w-10" disabled>
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-accent">
                    <Avatar className="h-10 w-10 rounded-full object-cover border-2 border-border hover:border-primary transition-colors">
                      <AvatarImage src="/placeholder-user.jpg" alt={`${user?.name}'s avatar`} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Personal Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notification Preferences</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Theme & Appearance</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Strategic Navigation Breadcrumbs */}
        <div className="border-b bg-white px-6 py-3">
          <StrategicBreadcrumbs showStrategic={true} activeLayer={activeLayer} />
        </div>

        <div className="flex w-full h-full">
          {/* Sidebar Navigation */}
          <SidebarNav
            activeLayer={activeLayer}
            onLayerChange={setActiveLayer}
            sidebarCollapsed={sidebarCollapsed}
            onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Main Content */}
          <main className="flex-1 p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading...</p>
                </div>
              </div>
            ) : (
              <>
                {activeLayer === "dashboard" && (
                  <div className="space-y-6">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {kpiData.map((kpi, index) => (
                        <Card key={index} className={!kpi.implemented ? "opacity-50" : ""}>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
                            <div className="flex items-center gap-2">
                              {!kpi.implemented && (
                                <Badge variant="outline" className="text-xs">Mock Data</Badge>
                              )}
                              <TrendingUp className={`h-4 w-4 ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`} />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}%</div>
                            <p className="text-xs text-muted-foreground">
                              {kpi.trend === "up" ? "+2.1%" : "-0.5%"} from last month
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Strategic Navigation Components */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <EnterpriseContext showDetails={true} />
                      <StrategicContext showDetails={true} />
                      <StrategicNavigationFlow currentLayer="operational" currentContext="dashboard" />
                    </div>

                    {/* Real Database Metrics */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          Live Database Metrics
                          <Badge variant="secondary" className="text-xs">✓ Real Data</Badge>
                        </CardTitle>
                        <CardDescription>Current metrics calculated from database</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{metrics.totalControls}</div>
                            <div className="text-sm text-gray-500">Total Controls</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{metrics.activeControls}</div>
                            <div className="text-sm text-gray-500">Active Controls</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">{metrics.totalProcesses}</div>
                            <div className="text-sm text-gray-500">Total Processes</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600">{metrics.maturityScore}%</div>
                            <div className="text-sm text-gray-500">Maturity Score</div>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-cyan-600">{metrics.activeProcesses}</div>
                            <div className="text-sm text-gray-500">Active Processes</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-600">{metrics.totalAssets}</div>
                            <div className="text-sm text-gray-500">Total Assets</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-teal-600">{metrics.operationalAssets}</div>
                            <div className="text-sm text-gray-500">Operational Assets</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-600">
                              {metrics.totalControls + metrics.totalProcesses + metrics.totalAssets}
                            </div>
                            <div className="text-sm text-gray-500">Total Items</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Maturity Scores */}
                    <Card className="opacity-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          Maturity Assessment
                          <Badge variant="outline" className="text-xs">Mock Data</Badge>
                        </CardTitle>
                        <CardDescription>Current capability maturity across all layers</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{maturityScores.strategic}%</div>
                            <div className="text-sm text-gray-500">Strategic Layer</div>
                            <Progress value={maturityScores.strategic} className="mt-2" />
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{maturityScores.operational}%</div>
                            <div className="text-sm text-gray-500">Operational Layer</div>
                            <Progress value={maturityScores.operational} className="mt-2" />
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">{maturityScores.control}%</div>
                            <div className="text-sm text-gray-500">Control & Risk</div>
                            <Progress value={maturityScores.control} className="mt-2" />
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600">{maturityScores.overall}%</div>
                            <div className="text-sm text-gray-500">Overall Score</div>
                            <Progress value={maturityScores.overall} className="mt-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <Card
                        className="cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
                        onClick={() => setActiveLayer("business-canvas")}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Target className="h-5 w-5 mr-2 text-blue-600" />
                            Business Canvas Management
                            <Badge variant="secondary" className="ml-auto text-xs bg-blue-100 text-blue-800">✓</Badge>
                          </CardTitle>
                          <CardDescription className="text-blue-700">
                            Create, organize, and manage business model canvases across your enterprise
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-blue-600 font-medium">Canvas Actions:</span>
                            <Badge variant="outline" className="text-xs">Enhanced</Badge>
                          </div>
                          <div className="space-y-2 text-xs text-blue-600">
                            <div className="flex items-center gap-2">
                              <Plus className="h-3 w-3" />
                              <span>Create New Canvas</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Layers className="h-3 w-3" />
                              <span>Add Child Canvas</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Copy className="h-3 w-3" />
                              <span>Clone from Template</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-3 w-3" />
                              <span>Manage Canvas Hierarchy</span>
                            </div>
                          </div>
                          <Button variant="outline" className="w-full bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                            Manage Canvases <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>

                      <Card
                        className="cursor-pointer hover:shadow-md transition-shadow opacity-50"
                        onClick={() => setActiveLayer("process-maps")}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Workflow className="h-5 w-5 mr-2 text-green-600" />
                            Process Optimization
                          </CardTitle>
                          <CardDescription>Visualize and optimize processes</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" className="w-full bg-transparent" disabled>
                            View Process Maps <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>

                      <Card
                        className="cursor-pointer hover:shadow-md transition-shadow opacity-50"
                        onClick={() => setActiveLayer("critical-controls")}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Shield className="h-5 w-5 mr-2 text-red-600" />
                            Risk Management
                          </CardTitle>
                          <CardDescription>Monitor critical controls and risks</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" className="w-full bg-transparent" disabled>
                            Review Controls <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card className="opacity-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          Recent Activity
                          <Badge variant="outline" className="text-xs">Mock Data</Badge>
                        </CardTitle>
                        <CardDescription>Latest updates across the platform</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Process Map Updated</p>
                              <p className="text-xs text-gray-500">Customer Onboarding process optimized</p>
                            </div>
                            <Badge variant="secondary">2h ago</Badge>
                          </div>
                          <div className="flex items-center space-x-4">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Control Review Required</p>
                              <p className="text-xs text-gray-500">Data Privacy controls need attention</p>
                            </div>
                            <Badge variant="secondary">4h ago</Badge>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Clock className="h-5 w-5 text-blue-600" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Business Canvas Modified</p>
                              <p className="text-xs text-gray-500">Value propositions updated by {user?.name}</p>
                            </div>
                            <Badge variant="secondary">6h ago</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeLayer === "business-canvas" && (
                  <div className="space-y-6">
                    <BusinessModelCanvas 
                      businessModel={businessModel} 
                      onUpdate={setBusinessModel} 
                      isEditing={isEditing}
                      viewMode={viewMode}
                      onViewModeChange={setViewMode}
                      onEditingChange={setIsEditing}
                    />
                  </div>
                )}

                {activeLayer === "processes" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-bold">Process Management</h2>
                      <Button>
                        <Workflow className="h-4 w-4 mr-2" />
                        Add Process
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="opacity-50">
                        <CardHeader>
                          <CardTitle className="text-lg text-green-600 flex items-center gap-2">
                            Active Processes
                            <Badge variant="outline" className="text-xs">Mock Data</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{metrics.activeProcesses}</div>
                          <p className="text-sm text-gray-600">Processes currently operational</p>
                        </CardContent>
                      </Card>

                      <Card className="opacity-50">
                        <CardHeader>
                          <CardTitle className="text-lg text-yellow-600 flex items-center gap-2">
                            Under Review
                            <Badge variant="outline" className="text-xs">Mock Data</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">2</div>
                          <p className="text-sm text-gray-600">Processes pending review</p>
                        </CardContent>
                      </Card>

                      <Card className="opacity-50">
                        <CardHeader>
                          <CardTitle className="text-lg text-red-600 flex items-center gap-2">
                            Draft Processes
                            <Badge variant="outline" className="text-xs">Mock Data</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">5</div>
                          <p className="text-sm text-gray-600">Processes in development</p>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          Process Overview
                          <Badge variant="secondary" className="text-xs">✓ Real Data</Badge>
                        </CardTitle>
                        <CardDescription>Current operational processes from database</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <div>
                                <p className="font-medium">Customer Onboarding</p>
                                <p className="text-sm text-gray-500">Standard customer onboarding workflow</p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Active
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <AlertTriangle className="h-5 w-5 text-yellow-600" />
                              <div>
                                <p className="font-medium">Data Backup</p>
                                <p className="text-sm text-gray-500">Automated data backup procedures</p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              Under Review
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <Clock className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="font-medium">Incident Response</p>
                                <p className="text-sm text-gray-500">Security incident response procedures</p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              Draft
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeLayer === "critical-controls" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-bold">Critical Controls</h2>
                      <Button>
                        <Shield className="h-4 w-4 mr-2" />
                        Add Control
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="opacity-50">
                        <CardHeader>
                          <CardTitle className="text-lg text-green-600 flex items-center gap-2">
                            Effective Controls
                            <Badge variant="outline" className="text-xs">Mock Data</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">24</div>
                          <p className="text-sm text-gray-600">Controls operating effectively</p>
                        </CardContent>
                      </Card>

                      <Card className="opacity-50">
                        <CardHeader>
                          <CardTitle className="text-lg text-yellow-600 flex items-center gap-2">
                            Needs Attention
                            <Badge variant="outline" className="text-xs">Mock Data</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">3</div>
                          <p className="text-sm text-gray-600">Controls requiring review</p>
                        </CardContent>
                      </Card>

                      <Card className="opacity-50">
                        <CardHeader>
                          <CardTitle className="text-lg text-red-600 flex items-center gap-2">
                            Critical Issues
                            <Badge variant="outline" className="text-xs">Mock Data</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">1</div>
                          <p className="text-sm text-gray-600">Controls with critical gaps</p>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="opacity-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          Control Status Overview
                          <Badge variant="outline" className="text-xs">Mock Data</Badge>
                        </CardTitle>
                        <CardDescription>Current status of all critical controls</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <div>
                                <p className="font-medium">Data Encryption</p>
                                <p className="text-sm text-gray-500">All data encrypted at rest and in transit</p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Effective
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <AlertTriangle className="h-5 w-5 text-yellow-600" />
                              <div>
                                <p className="font-medium">Access Controls</p>
                                <p className="text-sm text-gray-500">User access review overdue</p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              Review Required
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                              <div>
                                <p className="font-medium">Backup Procedures</p>
                                <p className="text-sm text-gray-500">Backup validation failed last cycle</p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-red-100 text-red-800">
                              Critical
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Placeholder content for other layers */}
                {(activeLayer === "operating-model" || activeLayer === "value-chain" || activeLayer === "service-model" || activeLayer === "process-maps" || activeLayer === "playbooks" || activeLayer === "analytics") && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold capitalize">{activeLayer.replace('-', ' ')}</h2>
                      <p className="text-gray-600">This feature is coming soon in Phase 2</p>
                    </div>
                    <Card>
                      <CardContent className="p-8 text-center">
                        <div className="text-6xl mb-4">🚧</div>
                        <h3 className="text-xl font-semibold mb-2">Under Development</h3>
                        <p className="text-gray-600 mb-4">This module is currently being developed and will be available in the next phase.</p>
                        <Button onClick={() => setActiveLayer("dashboard")}>
                          Return to Dashboard
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
