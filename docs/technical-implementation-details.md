# CapOpt Platform - Technical Implementation Details

## Phase 1: Functional PoC Technical Specifications

### 1. Database Schema Implementation

#### Prisma Schema (prisma/schema.prisma)

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Core Process Management
model Process {
  id          String   @id @default(cuid())
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  steps       ProcessStep[]
  controls    ProcessControl[]
  metrics     ProcessMetric[]
  risks       ProcessRisk[]

  @@map("processes")
}

model ProcessStep {
  id          String   @id @default(cuid())
  processId   String
  name        String
  description String?
  orderIndex  Int
  createdAt   DateTime @default(now())

  // Relationships
  process     Process  @relation(fields: [processId], references: [id], onDelete: Cascade)

  @@map("process_steps")
}

model ProcessMetric {
  id          String   @id @default(cuid())
  processId   String
  name        String
  value       Float
  unit        String?
  createdAt   DateTime @default(now())

  // Relationships
  process     Process  @relation(fields: [processId], references: [id], onDelete: Cascade)

  @@map("process_metrics")
}

model ProcessRisk {
  id          String   @id @default(cuid())
  processId   String
  name        String
  description String?
  severity    RiskSeverity
  createdAt   DateTime @default(now())

  // Relationships
  process     Process  @relation(fields: [processId], references: [id], onDelete: Cascade)

  @@map("process_risks")
}

// Critical Control Management
model CriticalControl {
  id              String   @id @default(cuid())
  name            String
  description     String?
  riskCategoryId  String?
  controlTypeId   String?
  effectivenessId String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relationships
  riskCategory    RiskCategory?    @relation(fields: [riskCategoryId], references: [id])
  controlType     ControlType?     @relation(fields: [controlTypeId], references: [id])
  effectiveness   ControlEffectiveness? @relation(fields: [effectivenessId], references: [id])
  processes       ProcessControl[]
  assets          AssetControl[]

  @@map("critical_controls")
}

model RiskCategory {
  id          String   @id @default(cuid())
  name        String
  description String?

  // Relationships
  controls    CriticalControl[]

  @@map("risk_categories")
}

model ControlType {
  id          String   @id @default(cuid())
  name        String
  description String?

  // Relationships
  controls    CriticalControl[]

  @@map("control_types")
}

model ControlEffectiveness {
  id          String   @id @default(cuid())
  rating      String   // "Effective", "Needs Attention", "Critical"
  description String?

  // Relationships
  controls    CriticalControl[]

  @@map("control_effectiveness")
}

// Asset Management
model Asset {
  id          String   @id @default(cuid())
  name        String
  description String?
  createdAt   DateTime @default(now())

  // Relationships
  controls    AssetControl[]

  @@map("assets")
}

// Cross-Entity Relationships
model ProcessControl {
  processId String
  controlId String

  // Relationships
  process   Process        @relation(fields: [processId], references: [id], onDelete: Cascade)
  control   CriticalControl @relation(fields: [controlId], references: [id], onDelete: Cascade)

  @@id([processId, controlId])
  @@map("process_controls")
}

model AssetControl {
  assetId   String
  controlId String

  // Relationships
  asset     Asset          @relation(fields: [assetId], references: [id], onDelete: Cascade)
  control   CriticalControl @relation(fields: [controlId], references: [id], onDelete: Cascade)

  @@id([assetId, controlId])
  @@map("asset_controls")
}

// Enums
enum RiskSeverity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}
```

### 2. Backend API Implementation

#### API Routes Structure

```typescript
// app/api/processes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { processSchema } from '@/lib/validations/process'

export async function GET() {
  try {
    const processes = await prisma.process.findMany({
      include: {
        steps: true,
        controls: {
          include: {
            control: true
          }
        },
        metrics: true,
        risks: true
      }
    })
    
    return NextResponse.json(processes)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch processes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = processSchema.parse(body)
    
    const process = await prisma.process.create({
      data: {
        name: validatedData.name,
        description: validatedData.description
      },
      include: {
        steps: true,
        controls: true,
        metrics: true,
        risks: true
      }
    })
    
    return NextResponse.json(process, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create process' },
      { status: 500 }
    )
  }
}
```

#### Validation Schemas

```typescript
// lib/validations/process.ts
import { z } from 'zod'

export const processSchema = z.object({
  name: z.string().min(1, 'Process name is required').max(255),
  description: z.string().optional(),
  steps: z.array(z.object({
    name: z.string().min(1, 'Step name is required'),
    description: z.string().optional(),
    orderIndex: z.number().int().min(0)
  })).optional()
})

export const processStepSchema = z.object({
  name: z.string().min(1, 'Step name is required'),
  description: z.string().optional(),
  orderIndex: z.number().int().min(0)
})

// lib/validations/control.ts
export const controlSchema = z.object({
  name: z.string().min(1, 'Control name is required').max(255),
  description: z.string().optional(),
  riskCategoryId: z.string().optional(),
  controlTypeId: z.string().optional(),
  effectivenessId: z.string().optional()
})

// lib/validations/asset.ts
export const assetSchema = z.object({
  name: z.string().min(1, 'Asset name is required').max(255),
  description: z.string().optional()
})
```

### 3. Frontend Component Implementation

#### Process Management Components

```typescript
// components/processes/process-form.tsx
"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { processSchema } from '@/lib/validations/process'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'

interface ProcessFormProps {
  onSubmit: (data: any) => void
  initialData?: any
}

export function ProcessForm({ onSubmit, initialData }: ProcessFormProps) {
  const [steps, setSteps] = useState(initialData?.steps || [])
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(processSchema),
    defaultValues: initialData
  })

  const addStep = () => {
    setSteps([...steps, { name: '', description: '', orderIndex: steps.length }])
  }

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const handleFormSubmit = (data: any) => {
    onSubmit({ ...data, steps })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Process</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Process Name
            </label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter process name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter process description"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium">Process Steps</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addStep}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </div>
            
            <div className="space-y-3">
              {steps.map((step: any, index: number) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Input
                    placeholder="Step name"
                    value={step.name}
                    onChange={(e) => {
                      const newSteps = [...steps]
                      newSteps[index].name = e.target.value
                      setSteps(newSteps)
                    }}
                  />
                  <Input
                    placeholder="Description"
                    value={step.description}
                    onChange={(e) => {
                      const newSteps = [...steps]
                      newSteps[index].description = e.target.value
                      setSteps(newSteps)
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeStep(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Creating...' : 'Create Process'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

#### Critical Control Components

```typescript
// components/controls/control-card.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react'

interface ControlCardProps {
  control: {
    id: string
    name: string
    description?: string
    effectiveness?: {
      rating: string
    }
    riskCategory?: {
      name: string
    }
  }
  onEdit?: (id: string) => void
  onView?: (id: string) => void
}

export function ControlCard({ control, onEdit, onView }: ControlCardProps) {
  const getEffectivenessIcon = (rating: string) => {
    switch (rating) {
      case 'Effective':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'Needs Attention':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'Critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Shield className="h-5 w-5 text-gray-600" />
    }
  }

  const getEffectivenessBadge = (rating: string) => {
    switch (rating) {
      case 'Effective':
        return <Badge className="bg-green-100 text-green-800">Effective</Badge>
      case 'Needs Attention':
        return <Badge className="bg-yellow-100 text-yellow-800">Needs Attention</Badge>
      case 'Critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            {getEffectivenessIcon(control.effectiveness?.rating || 'Unknown')}
            <span>{control.name}</span>
          </CardTitle>
          {getEffectivenessBadge(control.effectiveness?.rating || 'Unknown')}
        </div>
        {control.riskCategory && (
          <Badge variant="outline">{control.riskCategory.name}</Badge>
        )}
      </CardHeader>
      <CardContent>
        {control.description && (
          <p className="text-sm text-gray-600 mb-4">{control.description}</p>
        )}
        
        <div className="flex space-x-2">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(control.id)}
              className="flex-1"
            >
              View Details
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(control.id)}
              className="flex-1"
            >
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

#### Analytics Dashboard Components

```typescript
// components/analytics/kpi-cards.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KPICardProps {
  title: string
  value: number
  unit?: string
  trend?: 'up' | 'down'
  trendValue?: number
  progress?: number
  color?: 'blue' | 'green' | 'orange' | 'purple'
}

export function KPICard({
  title,
  value,
  unit = '%',
  trend,
  trendValue,
  progress,
  color = 'blue'
}: KPICardProps) {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600'
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {trend && (
          <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {trendValue && `${trendValue}%`}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${colorClasses[color]}`}>
          {value}{unit}
        </div>
        {progress !== undefined && (
          <Progress value={progress} className="mt-2" />
        )}
      </CardContent>
    </Card>
  )
}

// components/analytics/dashboard.tsx
"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KPICard } from './kpi-cards'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DashboardData {
  kpis: {
    processEfficiency: number
    riskCoverage: number
    valueDelivery: number
    complianceScore: number
  }
  processData: Array<{
    name: string
    efficiency: number
  }>
  controlData: Array<{
    category: string
    count: number
  }>
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch dashboard data
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics/dashboard')
        const dashboardData = await response.json()
        setData(dashboardData)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>Loading dashboard...</div>
  }

  if (!data) {
    return <div>Failed to load dashboard data</div>
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Process Efficiency"
          value={data.kpis.processEfficiency}
          trend="up"
          trendValue={5}
          progress={data.kpis.processEfficiency}
          color="blue"
        />
        <KPICard
          title="Risk Coverage"
          value={data.kpis.riskCoverage}
          trend="up"
          trendValue={2}
          progress={data.kpis.riskCoverage}
          color="green"
        />
        <KPICard
          title="Value Delivery"
          value={data.kpis.valueDelivery}
          trend="down"
          trendValue={3}
          progress={data.kpis.valueDelivery}
          color="orange"
        />
        <KPICard
          title="Compliance Score"
          value={data.kpis.complianceScore}
          trend="up"
          trendValue={1}
          progress={data.kpis.complianceScore}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Process Efficiency by Process</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.processData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="efficiency" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Controls by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.controlData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### 4. Database Setup and Configuration

#### Environment Configuration

```bash
# .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/capopt_platform"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

#### Database Initialization Script

```sql
-- scripts/init-database.sql
-- Initialize database with seed data for Phase 1

-- Insert default risk categories
INSERT INTO risk_categories (id, name, description) VALUES
('rc-1', 'Operational Risk', 'Risks related to day-to-day operations'),
('rc-2', 'Safety Risk', 'Risks related to workplace safety'),
('rc-3', 'Compliance Risk', 'Risks related to regulatory compliance'),
('rc-4', 'Financial Risk', 'Risks related to financial performance'),
('rc-5', 'Technology Risk', 'Risks related to technology systems');

-- Insert default control types
INSERT INTO control_types (id, name, description) VALUES
('ct-1', 'Preventive Control', 'Controls that prevent risks from occurring'),
('ct-2', 'Detective Control', 'Controls that detect when risks occur'),
('ct-3', 'Corrective Control', 'Controls that correct issues after detection'),
('ct-4', 'Compensating Control', 'Controls that compensate for other control failures');

-- Insert default control effectiveness ratings
INSERT INTO control_effectiveness (id, rating, description) VALUES
('ce-1', 'Effective', 'Control is operating effectively'),
('ce-2', 'Needs Attention', 'Control requires review and improvement'),
('ce-3', 'Critical', 'Control has critical gaps requiring immediate attention');

-- Insert sample processes
INSERT INTO processes (id, name, description) VALUES
('p-1', 'Customer Onboarding', 'End-to-end customer onboarding process'),
('p-2', 'Order Processing', 'Order fulfillment and processing workflow'),
('p-3', 'Support Resolution', 'Customer support ticket resolution process');

-- Insert sample critical controls
INSERT INTO critical_controls (id, name, description, risk_category_id, control_type_id, effectiveness_id) VALUES
('cc-1', 'Data Encryption', 'All data encrypted at rest and in transit', 'rc-3', 'ct-1', 'ce-1'),
('cc-2', 'Access Controls', 'User access management and review', 'rc-3', 'ct-1', 'ce-2'),
('cc-3', 'Backup Procedures', 'Automated backup and recovery procedures', 'rc-5', 'ct-2', 'ce-3');

-- Link processes to controls
INSERT INTO process_controls (process_id, control_id) VALUES
('p-1', 'cc-1'),
('p-1', 'cc-2'),
('p-2', 'cc-1'),
('p-3', 'cc-2');
```

### 5. Testing Strategy

#### Unit Tests

```typescript
// __tests__/components/process-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProcessForm } from '@/components/processes/process-form'

describe('ProcessForm', () => {
  it('renders form fields correctly', () => {
    const mockOnSubmit = jest.fn()
    render(<ProcessForm onSubmit={mockOnSubmit} />)

    expect(screen.getByLabelText(/process name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByText(/process steps/i)).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const mockOnSubmit = jest.fn()
    render(<ProcessForm onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByText(/create process/i)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/process name is required/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const mockOnSubmit = jest.fn()
    render(<ProcessForm onSubmit={mockOnSubmit} />)

    fireEvent.change(screen.getByLabelText(/process name/i), {
      target: { value: 'Test Process' }
    })

    const submitButton = screen.getByText(/create process/i)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Process',
        description: '',
        steps: []
      })
    })
  })
})
```

#### API Tests

```typescript
// __tests__/api/processes.test.ts
import { createMocks } from 'node-mocks-http'
import { GET, POST } from '@/app/api/processes/route'

describe('/api/processes', () => {
  it('GET returns list of processes', async () => {
    const { req, res } = createMocks({
      method: 'GET'
    })

    await GET(req)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(Array.isArray(data)).toBe(true)
  })

  it('POST creates new process', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Test Process',
        description: 'Test Description'
      }
    })

    await POST(req)

    expect(res._getStatusCode()).toBe(201)
    const data = JSON.parse(res._getData())
    expect(data.name).toBe('Test Process')
  })
})
```

### 6. Deployment Configuration

#### Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/capopt_platform
      - NEXTAUTH_SECRET=your-secret-key
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=capopt_platform
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

This technical implementation provides the foundation for Phase 1 development with:

1. **Complete database schema** with all core entities
2. **API endpoints** for all CRUD operations
3. **Frontend components** for all major features
4. **Validation schemas** for data integrity
5. **Testing strategy** for quality assurance
6. **Deployment configuration** for production readiness

The implementation follows the exact user stories from the Phase 1 backlog and provides a solid foundation for Phase 2 development. 