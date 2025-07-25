"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Share,
  Users,
  Handshake,
  Activity,
  Package,
  Heart,
  Radio,
  DollarSign,
  TrendingDown,
  Save,
  Eye,
  Copy,
} from "lucide-react"

interface CanvasItem {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
}

interface BusinessModel {
  keyPartners: CanvasItem[]
  keyActivities: CanvasItem[]
  keyResources: CanvasItem[]
  valuePropositions: CanvasItem[]
  customerRelationships: CanvasItem[]
  channels: CanvasItem[]
  customerSegments: CanvasItem[]
  costStructure: CanvasItem[]
  revenueStreams: CanvasItem[]
}

export function BusinessCanvas() {
  const [businessModel, setBusinessModel] = useState<BusinessModel>({
    keyPartners: [
      {
        id: "1",
        title: "Technology Vendors",
        description: "Cloud infrastructure and software providers",
        priority: "high",
      },
      {
        id: "2",
        title: "Strategic Consultants",
        description: "Industry expertise and implementation partners",
        priority: "medium",
      },
    ],
    keyActivities: [
      {
        id: "1",
        title: "Platform Development",
        description: "Continuous development and enhancement of the CapOpt platform",
        priority: "high",
      },
      {
        id: "2",
        title: "Customer Success",
        description: "Onboarding, training, and ongoing support",
        priority: "high",
      },
    ],
    keyResources: [
      { id: "1", title: "Development Team", description: "Skilled engineers and product managers", priority: "high" },
      {
        id: "2",
        title: "Intellectual Property",
        description: "Proprietary algorithms and methodologies",
        priority: "high",
      },
    ],
    valuePropositions: [
      {
        id: "1",
        title: "End-to-End Optimization",
        description: "Complete visibility from strategy to execution",
        priority: "high",
      },
      {
        id: "2",
        title: "Risk Integration",
        description: "Built-in risk management across all layers",
        priority: "high",
      },
    ],
    customerRelationships: [
      {
        id: "1",
        title: "Dedicated Support",
        description: "Personal account management for enterprise clients",
        priority: "high",
      },
      {
        id: "2",
        title: "Community Platform",
        description: "User community for best practices sharing",
        priority: "medium",
      },
    ],
    channels: [
      { id: "1", title: "Direct Sales", description: "Enterprise sales team for large accounts", priority: "high" },
      { id: "2", title: "Partner Network", description: "Implementation partners and resellers", priority: "medium" },
    ],
    customerSegments: [
      {
        id: "1",
        title: "Large Enterprises",
        description: "Fortune 500 companies with complex operations",
        priority: "high",
      },
      {
        id: "2",
        title: "Mid-Market",
        description: "Growing companies seeking operational excellence",
        priority: "medium",
      },
    ],
    costStructure: [
      {
        id: "1",
        title: "Development Costs",
        description: "Engineering and product development expenses",
        priority: "high",
      },
      { id: "2", title: "Infrastructure", description: "Cloud hosting and security infrastructure", priority: "high" },
    ],
    revenueStreams: [
      { id: "1", title: "SaaS Subscriptions", description: "Monthly/annual platform subscriptions", priority: "high" },
      {
        id: "2",
        title: "Professional Services",
        description: "Implementation and consulting services",
        priority: "medium",
      },
    ],
  })

  const [editingItem, setEditingItem] = useState<{ section: keyof BusinessModel; item: CanvasItem } | null>(null)
  const [newItem, setNewItem] = useState<{ section: keyof BusinessModel } | null>(null)
  const [viewMode, setViewMode] = useState<"edit" | "present">("edit")

  const sectionConfig = {
    keyPartners: {
      title: "Key Partners",
      icon: Handshake,
      color: "bg-blue-50 border-blue-200",
      description: "Who are our key partners and suppliers?",
    },
    keyActivities: {
      title: "Key Activities",
      icon: Activity,
      color: "bg-green-50 border-green-200",
      description: "What key activities does our value proposition require?",
    },
    keyResources: {
      title: "Key Resources",
      icon: Package,
      color: "bg-purple-50 border-purple-200",
      description: "What key resources does our value proposition require?",
    },
    valuePropositions: {
      title: "Value Propositions",
      icon: Heart,
      color: "bg-red-50 border-red-200",
      description: "What value do we deliver to customers?",
    },
    customerRelationships: {
      title: "Customer Relationships",
      icon: Users,
      color: "bg-orange-50 border-orange-200",
      description: "What type of relationship does each customer segment expect?",
    },
    channels: {
      title: "Channels",
      icon: Radio,
      color: "bg-yellow-50 border-yellow-200",
      description: "Through which channels do we reach our customers?",
    },
    customerSegments: {
      title: "Customer Segments",
      icon: Users,
      color: "bg-indigo-50 border-indigo-200",
      description: "For whom are we creating value?",
    },
    costStructure: {
      title: "Cost Structure",
      icon: TrendingDown,
      color: "bg-gray-50 border-gray-200",
      description: "What are the most important costs in our business model?",
    },
    revenueStreams: {
      title: "Revenue Streams",
      icon: DollarSign,
      color: "bg-emerald-50 border-emerald-200",
      description: "For what value are customers willing to pay?",
    },
  }

  const addItem = (section: keyof BusinessModel, item: Omit<CanvasItem, "id">) => {
    const newId = Date.now().toString()
    setBusinessModel((prev) => ({
      ...prev,
      [section]: [...prev[section], { ...item, id: newId }],
    }))
  }

  const updateItem = (section: keyof BusinessModel, itemId: string, updates: Partial<CanvasItem>) => {
    setBusinessModel((prev) => ({
      ...prev,
      [section]: prev[section].map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
    }))
  }

  const deleteItem = (section: keyof BusinessModel, itemId: string) => {
    setBusinessModel((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== itemId),
    }))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderCanvasSection = (sectionKey: keyof BusinessModel) => {
    const section = sectionConfig[sectionKey]
    const items = businessModel[sectionKey]
    const Icon = section.icon

    return (
      <Card key={sectionKey} className={`${section.color} min-h-[350px] h-full`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-xl">
            <Icon className="h-6 w-6 mr-3" />
            {section.title}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">{section.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-base leading-tight">{item.title}</h4>
                <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                  <Badge variant="secondary" className={getPriorityColor(item.priority)}>
                    {item.priority}
                  </Badge>
                  {viewMode === "edit" && (
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setEditingItem({ section: sectionKey, item })}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        onClick={() => deleteItem(sectionKey, item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}

          {viewMode === "edit" && (
            <Button
              variant="dashed"
              className="w-full border-2 border-dashed border-gray-300 hover:border-gray-400 bg-transparent py-3"
              onClick={() => setNewItem({ section: sectionKey })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {section.title.slice(0, -1)}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold mb-2">Business Model Canvas</h2>
          <p className="text-gray-600 text-lg">Define and visualize your business model across 9 key components</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant={viewMode === "edit" ? "default" : "outline"}
            onClick={() => setViewMode("edit")}
            className="px-6"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant={viewMode === "present" ? "default" : "outline"}
            onClick={() => setViewMode("present")}
            className="px-6"
          >
            <Eye className="h-4 w-4 mr-2" />
            Present
          </Button>
          <Button variant="outline" className="px-6 bg-transparent">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" className="px-6 bg-transparent">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" className="px-6 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Canvas Grid */}
      <div className="grid grid-cols-5 gap-6 min-h-[800px]">
        {/* Row 1 - Top sections */}
        <div className="col-span-1 row-span-2">{renderCanvasSection("keyPartners")}</div>
        <div className="col-span-1">{renderCanvasSection("keyActivities")}</div>
        <div className="col-span-1 row-span-2">{renderCanvasSection("valuePropositions")}</div>
        <div className="col-span-1">{renderCanvasSection("customerRelationships")}</div>
        <div className="col-span-1 row-span-2">{renderCanvasSection("customerSegments")}</div>

        {/* Row 2 - Middle sections */}
        <div className="col-span-1">{renderCanvasSection("keyResources")}</div>
        <div className="col-span-1">{renderCanvasSection("channels")}</div>

        {/* Row 3 - Bottom sections */}
        <div className="col-span-2">{renderCanvasSection("costStructure")}</div>
        <div className="col-span-3">{renderCanvasSection("revenueStreams")}</div>
      </div>

      {/* Templates and Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Templates & Examples</CardTitle>
          <CardDescription>Get started quickly with pre-built templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">SaaS Platform</CardTitle>
                <CardDescription>Template for software-as-a-service businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Copy className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Consulting Services</CardTitle>
                <CardDescription>Template for professional services firms</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Copy className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">E-commerce</CardTitle>
                <CardDescription>Template for online retail businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Copy className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>Update the details for this business model component</DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingItem.item.title}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, title: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingItem.item.description}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, description: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  className="w-full p-2 border rounded-md"
                  value={editingItem.item.priority}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, priority: e.target.value as "high" | "medium" | "low" },
                    })
                  }
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingItem) {
                  updateItem(editingItem.section, editingItem.item.id, editingItem.item)
                  setEditingItem(null)
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Item Dialog */}
      <Dialog open={!!newItem} onOpenChange={() => setNewItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>Add a new component to your business model</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              if (newItem) {
                addItem(newItem.section, {
                  title: formData.get("title") as string,
                  description: formData.get("description") as string,
                  priority: formData.get("priority") as "high" | "medium" | "low",
                })
                setNewItem(null)
              }
            }}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-title">Title</Label>
                <Input id="new-title" name="title" required />
              </div>
              <div>
                <Label htmlFor="new-description">Description</Label>
                <Textarea id="new-description" name="description" required />
              </div>
              <div>
                <Label htmlFor="new-priority">Priority</Label>
                <select
                  id="new-priority"
                  name="priority"
                  className="w-full p-2 border rounded-md"
                  defaultValue="medium"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setNewItem(null)}>
                Cancel
              </Button>
              <Button type="submit">Add Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
