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
import { TextEncoder, TextDecoder } from 'util';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock fetch
global.fetch = jest.fn();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock TextEncoder/TextDecoder for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock console methods to reduce noise in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: componentWillReceiveProps has been renamed')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Mock Prisma Client for unit tests
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    enterprise: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    businessCanvas: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    node: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    edge: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $executeRaw: jest.fn(),
  })),
}));

// Mock environment variables
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.TEST_DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

// Global test utilities
global.testUtils = {
  // Mock user data
  createMockUser: () => ({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }),

  // Mock enterprise data
  createMockEnterprise: () => ({
    id: 'test-enterprise-id',
    name: 'Test Enterprise',
    legalName: 'Test Enterprise Pty Ltd',
    abn: '12345678901',
    industry: 'MINING_METALS',
    sector: 'COPPER',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }),

  // Mock business canvas data
  createMockCanvas: () => ({
    id: 'test-canvas-id',
    name: 'Test Business Canvas',
    description: 'Test canvas description',
    industry: 'MINING_METALS',
    sectors: ['COPPER'],
    status: 'DRAFT',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }),

  // Mock process data
  createMockProcess: () => ({
    id: 'test-process-id',
    name: 'Test Process',
    description: 'Test process description',
    status: 'ACTIVE',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }),

  // Mock control data
  createMockControl: () => ({
    id: 'test-control-id',
    name: 'Test Control',
    description: 'Test control description',
    type: 'PREVENTIVE',
    category: 'SAFETY',
    isCritical: true,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }),

  // Mock asset data
  createMockAsset: () => ({
    id: 'test-asset-id',
    name: 'Test Asset',
    description: 'Test asset description',
    type: 'EQUIPMENT',
    status: 'OPERATIONAL',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }),

  // Mock graph node data
  createMockGraphNode: () => ({
    id: 'test-node-id',
    type: 'enterprise',
    label: 'Test Enterprise',
    metadata: { originalId: 'test-enterprise-id' },
  }),

  // Mock graph edge data
  createMockGraphEdge: () => ({
    fromId: 'test-from-id',
    toId: 'test-to-id',
    relationType: 'operates',
    metadata: { relationshipType: 'ownership' },
  }),

  // Create canvas hierarchy
  createCanvasHierarchy: (depth, breadth) => {
    const hierarchy = [];
    for (let i = 0; i < depth; i++) {
      const level = [];
      for (let j = 0; j < breadth; j++) {
        level.push({
          id: `canvas-${i}-${j}`,
          name: `Canvas ${i}-${j}`,
          parentId: i > 0 ? `canvas-${i-1}-${Math.floor(j/breadth)}` : null,
        });
      }
      hierarchy.push(level);
    }
    return hierarchy;
  },

  // Create multiple canvases
  createMultipleCanvases: (count) => {
    const canvases = [];
    for (let i = 0; i < count; i++) {
      canvases.push({
        id: `canvas-${i}`,
        name: `Canvas ${i}`,
        description: `Description for canvas ${i}`,
        industry: 'MINING_METALS',
        sectors: ['COPPER'],
        status: 'DRAFT',
        isActive: true,
      });
    }
    return canvases;
  },

  // Simulate real-time editing
  simulateRealTimeEditing: async (screen, changes) => {
    for (const change of changes) {
      if (change.type === 'input') {
        const element = screen.getByTestId(change.target);
        element.value = change.value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
    // Wait for any async updates
    await new Promise(resolve => setTimeout(resolve, 100));
  },
};

// Custom matchers for testing
expect.extend({
  toBeValidUUID(received) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pass = uuidRegex.test(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid UUID`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid UUID`,
        pass: false,
      };
    }
  },

  toBeValidDate(received) {
    const pass = received instanceof Date && !isNaN(received.getTime());
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid Date`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid Date`,
        pass: false,
      };
    }
  },
}); 