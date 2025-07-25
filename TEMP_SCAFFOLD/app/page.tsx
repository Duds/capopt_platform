"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Target,
  Workflow,
  Shield,
  TrendingUp,
  Users,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Network,
  Layers,
  Activity,
  PieChart,
  Map,
  BookOpen,
  Gauge,
} from "lucide-react"
import { BusinessCanvas } from "./components/business-canvas"

export default function CapOptPlatform() {
  const [activeLayer, setActiveLayer] = useState("dashboard")

  const maturityScores = {
    strategic: 75,
    operational: 68,
    control: 82,
    overall: 72,
  }

  const kpiData = [
    { label: "Process Efficiency", value: 85, trend: "up" },
    { label: "Risk Coverage", value: 92, trend: "up" },
    { label: "Value Delivery", value: 78, trend: "down" },
    { label: "Compliance Score", value: 96, trend: "up" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Layers className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">CapOpt Platform</h1>
            </div>
            <Badge variant="secondary">Enterprise</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
          <div className="space-y-2">
            <Button
              variant={activeLayer === "dashboard" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveLayer("dashboard")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>

            <div className="pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">STRATEGIC LAYER</h3>
              <Button
                variant={activeLayer === "business-canvas" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveLayer("business-canvas")}
              >
                <Target className="h-4 w-4 mr-2" />
                Business Canvas
              </Button>
              <Button
                variant={activeLayer === "operating-model" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveLayer("operating-model")}
              >
                <Network className="h-4 w-4 mr-2" />
                Operating Model
              </Button>
            </div>

            <div className="pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">VALUE & SERVICE</h3>
              <Button
                variant={activeLayer === "value-chain" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveLayer("value-chain")}
              >
                <Workflow className="h-4 w-4 mr-2" />
                Value Chain
              </Button>
              <Button
                variant={activeLayer === "service-model" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveLayer("service-model")}
              >
                <Users className="h-4 w-4 mr-2" />
                Service Model
              </Button>
            </div>

            <div className="pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">OPERATIONAL</h3>
              <Button
                variant={activeLayer === "process-maps" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveLayer("process-maps")}
              >
                <Map className="h-4 w-4 mr-2" />
                Process Maps
              </Button>
              <Button
                variant={activeLayer === "playbooks" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveLayer("playbooks")}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Playbooks
              </Button>
            </div>

            <div className="pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">CONTROL & RISK</h3>
              <Button
                variant={activeLayer === "critical-controls" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveLayer("critical-controls")}
              >
                <Shield className="h-4 w-4 mr-2" />
                Critical Controls
              </Button>
              <Button
                variant={activeLayer === "analytics" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveLayer("analytics")}
              >
                <Activity className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeLayer === "dashboard" && (
            <div className="space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
                      <TrendingUp className={`h-4 w-4 ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{kpi.value}%</div>
                      <Progress value={kpi.value} className="mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Maturity Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Capability Maturity Overview</CardTitle>
                  <CardDescription>Current maturity scores across all layers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setActiveLayer("business-canvas")}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2 text-blue-600" />
                      Strategic Planning
                    </CardTitle>
                    <CardDescription>Define business model and strategy</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full bg-transparent">
                      Access Business Canvas <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
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
                    <Button variant="outline" className="w-full bg-transparent">
                      View Process Maps <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
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
                    <Button variant="outline" className="w-full bg-transparent">
                      Review Controls <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
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
                        <p className="text-sm font-medium">Maturity Assessment Scheduled</p>
                        <p className="text-xs text-gray-500">Quarterly review starts tomorrow</p>
                      </div>
                      <Badge variant="secondary">1d ago</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeLayer === "business-canvas" && <BusinessCanvas />}

          {activeLayer === "process-maps" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Process Maps</h2>
                <Button>
                  <Map className="h-4 w-4 mr-2" />
                  Create New Map
                </Button>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="customer-journey">Customer Journey</TabsTrigger>
                  <TabsTrigger value="operations">Operations</TabsTrigger>
                  <TabsTrigger value="support">Support</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Workflow className="h-5 w-5 mr-2" />
                          Customer Onboarding
                        </CardTitle>
                        <CardDescription>End-to-end customer onboarding process</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Efficiency Score</span>
                            <span className="text-sm font-medium">85%</span>
                          </div>
                          <Progress value={85} />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Last updated: 2 days ago</span>
                            <span>12 steps</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <PieChart className="h-5 w-5 mr-2" />
                          Order Processing
                        </CardTitle>
                        <CardDescription>Order fulfillment and processing</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Efficiency Score</span>
                            <span className="text-sm font-medium">92%</span>
                          </div>
                          <Progress value={92} />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Last updated: 1 day ago</span>
                            <span>8 steps</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Users className="h-5 w-5 mr-2" />
                          Support Resolution
                        </CardTitle>
                        <CardDescription>Customer support ticket resolution</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Efficiency Score</span>
                            <span className="text-sm font-medium">78%</span>
                          </div>
                          <Progress value={78} />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Last updated: 3 days ago</span>
                            <span>15 steps</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
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
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-green-600">Effective Controls</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">24</div>
                    <p className="text-sm text-gray-600">Controls operating effectively</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-yellow-600">Needs Attention</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">3</div>
                    <p className="text-sm text-gray-600">Controls requiring review</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-red-600">Critical Issues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">1</div>
                    <p className="text-sm text-gray-600">Controls with critical gaps</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Control Status Overview</CardTitle>
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

          {activeLayer === "analytics" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Analytics & Insights</h2>
                <Button>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Process Efficiency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">85%</div>
                    <p className="text-sm text-gray-600">Average across all processes</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">+5% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Risk Coverage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">92%</div>
                    <p className="text-sm text-gray-600">Controls covering identified risks</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">+2% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Value Delivery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">78%</div>
                    <p className="text-sm text-gray-600">Customer value realization</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-red-600 mr-1 rotate-180" />
                      <span className="text-sm text-red-600">-3% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Maturity Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">72%</div>
                    <p className="text-sm text-gray-600">Overall capability maturity</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">+8% from last quarter</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Predictive Insights</CardTitle>
                  <CardDescription>AI-powered recommendations for optimization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Gauge className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-900">Process Optimization Opportunity</p>
                          <p className="text-sm text-blue-700">
                            Customer onboarding process could be streamlined by 15% by automating document verification
                            steps.
                          </p>
                          <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-900">Control Enhancement</p>
                          <p className="text-sm text-green-700">
                            Implementing automated monitoring for data access controls could improve coverage by 12%.
                          </p>
                          <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                            Implement
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-900">Risk Alert</p>
                          <p className="text-sm text-yellow-700">
                            Trend analysis indicates potential bottleneck in order processing during peak periods.
                          </p>
                          <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                            Investigate
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
