/**
 * Jest Setup for CapOpt Platform
 * 
 * This file configures the testing environment with:
 * - React Testing Library setup
 * - Custom matchers
 * - Test ID validation
 * - Mock service worker setup
 * - Global test utilities
 */

import '@testing-library/jest-dom';
import { testIds, isValidTestId } from './lib/testSelectors';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';

// Extend Jest matchers
expect.extend({
  toHaveValidTestId(received, testId) {
    const pass = received.getAttribute('data-testid') === testId && isValidTestId(testId);
    return {
      pass,
      message: () => `expected element ${pass ? 'not ' : ''}to have valid test ID "${testId}"`,
    };
  },

  toHaveValidTestIdAttribute(received) {
    const testId = received.getAttribute('data-testid');
    const pass = testId && isValidTestId(testId);
    return {
      pass,
      message: () => `expected element ${pass ? 'not ' : ''}to have valid test ID attribute`,
    };
  },

  toBeAustralianBusinessData(received) {
    // Validate Australian business data patterns
    const hasValidABN = received.abn && /^\d{11}$/.test(received.abn);
    const hasValidACN = received.acn && /^\d{9}$/.test(received.acn);
    const hasValidLocation = received.primaryLocation && received.primaryLocation.includes('Australia');
    const hasValidIndustry = received.industry && ['MINING', 'OIL_GAS', 'MANUFACTURING'].includes(received.industry);
    
    const pass = hasValidABN && hasValidACN && hasValidLocation && hasValidIndustry;
    return {
      pass,
      message: () => `expected data ${pass ? 'not ' : ''}to be valid Australian business data`,
    };
  },
});

// Enhanced test utilities for complex component testing
global.testUtils = {
  // Basic mock data creators (existing)
  createMockUser: (overrides = {}) => ({
    id: 'test-user-id',
    name: 'John Smith',
    email: 'john.smith@crackedmountain.com.au',
    role: 'ADMIN',
    isActive: true,
    lastLogin: new Date('2024-01-15T10:30:00Z'),
    createdAt: new Date('2024-01-01T09:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
    ...overrides,
  }),

  createMockEnterprise: (overrides = {}) => ({
    id: 'test-enterprise-id',
    name: 'Cracked Mountain Mining',
    legalName: 'Cracked Mountain Mining Pty Ltd',
    abn: '12345678901',
    acn: '123456789',
    industry: 'MINING',
    sector: 'COAL',
    isActive: true,
    createdAt: new Date('2024-01-01T09:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
    ...overrides,
  }),

  createMockCanvas: (overrides = {}) => ({
    id: 'test-canvas-id',
    name: 'Strategic Business Model',
    description: 'Comprehensive business model for mining operations',
    version: '1.0.0',
    isActive: true,
    status: 'DRAFT',
    editMode: 'SINGLE_USER',
    autoSave: true,
    parentCanvasId: null,
    
    // Enhanced metadata
    legalName: 'Cracked Mountain Mining Pty Ltd',
    abn: '12345678901',
    acn: '123456789',
    industry: 'MINING',
    sectors: ['COAL', 'PRODUCTION'],
    sectorTypes: ['EXTRACTIVE', 'PROCESSING'],
    primarySector: 'COAL',
    businessType: 'CORPORATION',
    regional: 'REGIONAL',
    primaryLocation: 'Queensland, Australia',
    coordinates: '-23.5505,146.8250',
    facilityType: 'OPEN_PIT_MINE',
    operationalStreams: ['EXTRACTION', 'PROCESSING', 'TRANSPORT'],
    strategicObjective: 'Sustainable mining operations',
    valueProposition: 'High-quality coal for energy production',
    competitiveAdvantage: 'Advanced extraction technology',
    annualRevenue: 50000000.00,
    employeeCount: 150,
    riskProfile: 'MEDIUM',
    complianceRequirements: ['ISO 14001', 'OHSAS 18001'],
    regulatoryFramework: ['WHS Act', 'Mining Act'],
    
    createdAt: new Date('2024-01-01T09:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
    ...overrides,
  }),

  createMockProcess: (overrides = {}) => ({
    id: 'test-process-id',
    name: 'Safety Management Process',
    description: 'Comprehensive safety management for mining operations',
    version: '1.0.0',
    status: 'ACTIVE',
    priority: 'HIGH',
    isActive: true,
    createdById: 'test-user-id',
    enterpriseId: 'test-enterprise-id',
    facilityId: 'test-facility-id',
    businessUnitId: 'test-business-unit-id',
    departmentId: 'test-department-id',
    
    // Process relationships
    steps: [
      {
        id: 'test-step-1',
        name: 'Risk Assessment',
        description: 'Conduct risk assessment',
        orderIndex: 1,
        duration: 60,
        responsible: 'Safety Officer'
      }
    ],
    inputs: [
      {
        id: 'test-input-1',
        name: 'Safety Data',
        type: 'DATA',
        description: 'Historical safety data',
        required: true
      }
    ],
    outputs: [
      {
        id: 'test-output-1',
        name: 'Safety Report',
        type: 'REPORT',
        description: 'Safety assessment report',
        quality: 'HIGH'
      }
    ],
    metrics: [
      {
        id: 'test-metric-1',
        name: 'Safety Incidents',
        value: 0,
        unit: 'incidents/month',
        target: 0,
        frequency: 'MONTHLY'
      }
    ],
    risks: [
      {
        id: 'test-risk-1',
        name: 'Equipment Failure',
        severity: 'HIGH',
        likelihood: 'MEDIUM',
        impact: 'CRITICAL'
      }
    ],
    
    createdAt: new Date('2024-01-01T09:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
    ...overrides,
  }),

  createMockControl: (overrides = {}) => ({
    id: 'test-control-id',
    name: 'Safety Equipment Inspection',
    description: 'Regular inspection of safety equipment',
    controlCategory: 'SUPPORTING',
    isCritical: true,
    verificationFrequency: 'DAILY',
    complianceStatus: 'COMPLIANT',
    priority: 'HIGH',
    createdById: 'test-user-id',
    
    // Control relationships
    riskCategory: {
      id: 'test-risk-category-id',
      name: 'Safety',
      description: 'Safety-related risks',
      color: '#FF0000'
    },
    controlType: {
      id: 'test-control-type-id',
      name: 'Preventive',
      description: 'Preventive control measures',
      category: 'SAFETY'
    },
    effectiveness: {
      id: 'test-effectiveness-id',
      rating: 'Effective',
      description: 'Control is working effectively',
      score: 85
    },
    
    createdAt: new Date('2024-01-01T09:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
    ...overrides,
  }),

  createMockAsset: (overrides = {}) => ({
    id: 'test-asset-id',
    name: 'Excavator EX-001',
    type: 'EQUIPMENT',
    status: 'OPERATIONAL',
    criticality: 'HIGH',
    location: 'Mine Site A',
    description: 'Primary excavation equipment',
    version: '1.0.0',
    isActive: true,
    enterpriseId: 'test-enterprise-id',
    facilityId: 'test-facility-id',
    
    // Asset relationships
    risks: [
      {
        id: 'test-asset-risk-id',
        name: 'Mechanical Failure',
        severity: 'HIGH',
        likelihood: 'MEDIUM'
      }
    ],
    protection: [
      {
        id: 'test-protection-id',
        type: 'PREVENTIVE_MAINTENANCE',
        description: 'Regular maintenance schedule'
      }
    ],
    monitoring: [
      {
        id: 'test-monitor-id',
        type: 'PERFORMANCE',
        status: 'ACTIVE',
        frequency: 'HOURLY'
      }
    ],
    optimisation: [
      {
        id: 'test-optimisation-id',
        type: 'EFFICIENCY',
        status: 'IN_PROGRESS',
        target: '95%'
      }
    ],
    
    createdAt: new Date('2024-01-01T09:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
    ...overrides,
  }),

  // Complex component testing utilities
  renderWithProviders: (component, options = {}) => {
    const {
      router = {},
      session = {},
      prisma = {},
      ...renderOptions
    } = options;

    // Mock Next.js router
    const mockRouter = {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
      ...router,
    };

    // Mock NextAuth session
    const mockSession = {
      user: global.testUtils.createMockUser(),
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      ...session,
    };

    // Mock Prisma client
    const mockPrisma = {
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      businessCanvas: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      process: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      criticalControl: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      asset: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      ...prisma,
    };

    return {
      ...render(component, renderOptions),
      router: mockRouter,
      session: mockSession,
      prisma: mockPrisma,
    };
  },

  // Hierarchy testing utilities
  createCanvasHierarchy: (depth = 3, breadth = 2) => {
    const canvases = [];
    let idCounter = 1;

    const createLevel = (level, parentId = null) => {
      if (level > depth) return [];

      const levelCanvases = [];
      for (let i = 0; i < breadth; i++) {
        const canvas = global.testUtils.createMockCanvas({
          id: `canvas-${idCounter++}`,
          name: `Canvas Level ${level} - ${i + 1}`,
          parentCanvasId: parentId,
          childCanvases: createLevel(level + 1, `canvas-${idCounter - 1}`),
        });
        levelCanvases.push(canvas);
      }
      return levelCanvases;
    };

    return createLevel(1);
  },

  // Bulk operations testing utilities
  createMultipleCanvases: (count = 10) => {
    const canvases = [];
    for (let i = 0; i < count; i++) {
      canvases.push(global.testUtils.createMockCanvas({
        id: `canvas-bulk-${i + 1}`,
        name: `Bulk Canvas ${i + 1}`,
        status: i % 2 === 0 ? 'DRAFT' : 'PUBLISHED',
      }));
    }
    return canvases;
  },

  // Real-time editing testing utilities
  simulateRealTimeEditing: async (changes) => {
    const user = userEvent.setup();

    for (const change of changes) {
      const { type, target, value } = change;
      
      switch (type) {
        case 'input':
          await user.type(screen.getByTestId(target), value);
          break;
        case 'select':
          await user.selectOptions(screen.getByTestId(target), value);
          break;
        case 'click':
          await user.click(screen.getByTestId(target));
          break;
        case 'clear':
          await user.clear(screen.getByTestId(target));
          break;
      }

      // Simulate auto-save delay
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  },

  // Drag-and-drop testing utilities
  simulateDragAndDrop: async (source, target) => {
    const user = userEvent.setup();

    const sourceElement = screen.getByTestId(source);
    const targetElement = screen.getByTestId(target);

    // Simulate drag start
    await user.hover(sourceElement);
    await user.keyboard('{Space}');

    // Simulate drag over target
    await user.hover(targetElement);

    // Simulate drop
    await user.keyboard('{Space}');
  },

  // Complex form validation utilities
  validateComplexForm: (formData, schema) => {
    try {
      const result = schema.parse(formData);
      return { valid: true, data: result, errors: null };
    } catch (error) {
      return { valid: false, data: null, errors: error.errors };
    }
  },

  // API response mocking utilities
  mockComplexApiResponse: (endpoint, data) => {
    const mockResponse = {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-cache, no-store, must-revalidate',
      },
      body: data,
    };

    // Mock fetch for the specific endpoint
    global.fetch = jest.fn().mockImplementation((url) => {
      if (url.includes(endpoint)) {
        return Promise.resolve({
          ok: true,
          status: mockResponse.status,
          headers: new Headers(mockResponse.headers),
          json: () => Promise.resolve(mockResponse.body),
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  },

  // Test ID validation utilities
  validateTestIds: (component) => {
    const testIdElements = component.querySelectorAll('[data-testid]');
    const invalidTestIds = [];

    testIdElements.forEach(element => {
      const testId = element.getAttribute('data-testid');
      if (!isValidTestId(testId)) {
        invalidTestIds.push({
          element: element.tagName,
          testId,
          location: element.outerHTML.substring(0, 100) + '...',
        });
      }
    });

    return {
      valid: invalidTestIds.length === 0,
      invalidTestIds,
    };
  },

  // Mock Next.js router
  mockRouter: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  },

  // Mock NextAuth session
  mockSession: {
    user: {
      id: 'test-user-id',
      name: 'John Smith',
      email: 'john.smith@crackedmountain.com.au',
      role: 'ADMIN',
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
};

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => global.testUtils.mockRouter,
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock custom auth hook
jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    user: global.testUtils.createMockUser(),
    token: 'test-token',
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    isLoading: false,
    error: null,
  }),
  AuthProvider: ({ children }) => children,
}));

// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    businessCanvas: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    process: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    criticalControl: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    asset: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    industry: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    sector: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    bowtieModel: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    maturityAssessment: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// Mock fetch for API testing
global.fetch = jest.fn();

// Mock IntersectionObserver for component testing
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver for component testing
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia for responsive testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}; 