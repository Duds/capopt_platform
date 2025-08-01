/**
 * @test business-canvas.test.ts
 * @schema BusinessCanvas API endpoints
 * @testIds from `lib/testSelectors.ts`
 * @seed from `/prisma/seed/strategic/`
 * @note Complex API testing patterns for real-world implementation
 */

import request from 'supertest';
import { createServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { GET, POST, PATCH } from '@/app/api/business-canvas/route';
import { businessCanvasSchema } from '@/lib/validations/strategic';
import { prisma } from '@/lib/prisma';

// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    businessCanvas: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    enterprise: {
      findUnique: jest.fn(),
    },
    facility: {
      findUnique: jest.fn(),
    },
    businessUnit: {
      findUnique: jest.fn(),
    },
  },
}));

// Mock Next.js request/response
const createMockRequest = (method: string, url: string, body?: any) => {
  const req = {
    method,
    url,
    json: jest.fn().mockResolvedValue(body || {}),
    headers: {},
  } as any;

  // Add searchParams
  const urlObj = new URL(url, 'http://localhost:3000');
  req.nextUrl = { searchParams: urlObj.searchParams };

  return req;
};

const createMockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    headers: new Map(),
  } as any;

  res.headers.set = jest.fn();
  return res;
};

describe('Business Canvas API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/business-canvas', () => {
    it('should fetch all business canvases with basic query', async () => {
      const mockCanvases = [
        global.testUtils.createMockCanvas({ id: 'canvas-1' }),
        global.testUtils.createMockCanvas({ id: 'canvas-2' }),
      ];

      (prisma.businessCanvas.findMany as jest.Mock).mockResolvedValue(mockCanvases);

      const req = createMockRequest('GET', '/api/business-canvas');
      const res = createMockResponse();

      await GET(req as NextApiRequest, res as NextApiResponse);

      expect(prisma.businessCanvas.findMany).toHaveBeenCalledWith({
        where: {},
        include: {},
        orderBy: [
          { isActive: 'desc' },
          { updatedAt: 'desc' },
          { name: 'asc' }
        ]
      });
      expect(res.json).toHaveBeenCalledWith(mockCanvases);
    });

    it('should handle complex include clauses correctly', async () => {
      const mockCanvasesWithRelations = [
        global.testUtils.createMockCanvas({
          id: 'canvas-1',
          valuePropositions: [{ id: 'vp-1', description: 'Value Prop 1' }],
          customerSegments: [{ id: 'cs-1', name: 'Customer Segment 1' }],
          revenueStreams: [{ id: 'rs-1', type: 'Subscription' }],
        }),
      ];

      (prisma.businessCanvas.findMany as jest.Mock).mockResolvedValue(mockCanvasesWithRelations);

      const req = createMockRequest(
        'GET', 
        '/api/business-canvas?include=valuePropositions,customerSegments,revenueStreams'
      );
      const res = createMockResponse();

      await GET(req as NextApiRequest, res as NextApiResponse);

      expect(prisma.businessCanvas.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          valuePropositions: true,
          customerSegments: true,
          revenueStreams: true,
        },
        orderBy: [
          { isActive: 'desc' },
          { updatedAt: 'desc' },
          { name: 'asc' }
        ]
      });
    });

    it('should handle enterprise context filtering', async () => {
      const mockEnterpriseCanvases = [
        global.testUtils.createMockCanvas({ 
          id: 'canvas-1', 
          enterpriseId: 'enterprise-1' 
        }),
      ];

      (prisma.businessCanvas.findMany as jest.Mock).mockResolvedValue(mockEnterpriseCanvases);

      const req = createMockRequest(
        'GET', 
        '/api/business-canvas?enterpriseId=enterprise-1&facilityId=facility-1&businessUnitId=bu-1'
      );
      const res = createMockResponse();

      await GET(req as NextApiRequest, res as NextApiResponse);

      expect(prisma.businessCanvas.findMany).toHaveBeenCalledWith({
        where: {
          enterpriseId: 'enterprise-1',
          facilityId: 'facility-1',
          businessUnitId: 'bu-1',
        },
        include: {},
        orderBy: [
          { isActive: 'desc' },
          { updatedAt: 'desc' },
          { name: 'asc' }
        ]
      });
    });

    it('should handle active/inactive filtering', async () => {
      const mockActiveCanvases = [
        global.testUtils.createMockCanvas({ 
          id: 'canvas-1', 
          isActive: true 
        }),
      ];

      (prisma.businessCanvas.findMany as jest.Mock).mockResolvedValue(mockActiveCanvases);

      const req = createMockRequest('GET', '/api/business-canvas?isActive=true');
      const res = createMockResponse();

      await GET(req as NextApiRequest, res as NextApiResponse);

      expect(prisma.businessCanvas.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        include: {},
        orderBy: [
          { isActive: 'desc' },
          { updatedAt: 'desc' },
          { name: 'asc' }
        ]
      });
    });

    it('should set cache control headers', async () => {
      const mockCanvases = [global.testUtils.createMockCanvas()];
      (prisma.businessCanvas.findMany as jest.Mock).mockResolvedValue(mockCanvases);

      const req = createMockRequest('GET', '/api/business-canvas');
      const res = createMockResponse();

      await GET(req as NextApiRequest, res as NextApiResponse);

      expect(res.headers.set).toHaveBeenCalledWith('Cache-Control', 'no-cache, no-store, must-revalidate');
      expect(res.headers.set).toHaveBeenCalledWith('Pragma', 'no-cache');
      expect(res.headers.set).toHaveBeenCalledWith('Expires', '0');
    });

    it('should handle database errors gracefully', async () => {
      (prisma.businessCanvas.findMany as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      );

      const req = createMockRequest('GET', '/api/business-canvas');
      const res = createMockResponse();

      await GET(req as NextApiRequest, res as NextApiResponse);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch business canvases',
        details: 'Database connection failed'
      });
    });
  });

  describe('POST /api/business-canvas', () => {
    it('should create business canvas with basic data', async () => {
      const canvasData = {
        name: 'New Business Canvas',
        description: 'Test canvas description',
        industry: 'MINING',
        sector: 'COAL',
      };

      const createdCanvas = global.testUtils.createMockCanvas({
        id: 'new-canvas-id',
        ...canvasData,
      });

      (prisma.businessCanvas.create as jest.Mock).mockResolvedValue(createdCanvas);

      const req = createMockRequest('POST', '/api/business-canvas', canvasData);
      const res = createMockResponse();

      await POST(req as NextApiRequest, res as NextApiResponse);

      expect(prisma.businessCanvas.create).toHaveBeenCalledWith({
        data: expect.objectContaining(canvasData),
        include: expect.any(Object),
      });
      expect(res.json).toHaveBeenCalledWith(createdCanvas);
    });

    it('should create business canvas with complex metadata', async () => {
      const complexCanvasData = {
        name: 'Complex Business Canvas',
        description: 'Canvas with complex metadata',
        legalName: 'Complex Mining Corp Pty Ltd',
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
        operationalStreams: ['EXTRACTION', 'PROCESSING'],
        strategicObjective: 'Sustainable mining operations',
        valueProposition: 'High-quality coal for energy production',
        competitiveAdvantage: 'Advanced extraction technology',
        annualRevenue: 50000000.00,
        employeeCount: 150,
        riskProfile: 'MEDIUM',
        complianceRequirements: ['ISO 14001', 'OHSAS 18001'],
        regulatoryFramework: ['WHS Act', 'Mining Act'],
        enterpriseId: 'enterprise-1',
        facilityId: 'facility-1',
        businessUnitId: 'bu-1',
        parentCanvasId: null,
      };

      const createdCanvas = global.testUtils.createMockCanvas({
        id: 'complex-canvas-id',
        ...complexCanvasData,
      });

      (prisma.businessCanvas.create as jest.Mock).mockResolvedValue(createdCanvas);

      const req = createMockRequest('POST', '/api/business-canvas', complexCanvasData);
      const res = createMockResponse();

      await POST(req as NextApiRequest, res as NextApiResponse);

      expect(prisma.businessCanvas.create).toHaveBeenCalledWith({
        data: expect.objectContaining(complexCanvasData),
        include: expect.any(Object),
      });
      expect(res.json).toHaveBeenCalledWith(createdCanvas);
    });

    it('should validate complex metadata fields', async () => {
      const invalidCanvasData = {
        name: 'Invalid Canvas',
        abn: 'invalid-abn', // Invalid ABN format
        industry: 'INVALID_INDUSTRY', // Invalid industry
        businessType: 'INVALID_TYPE', // Invalid business type
      };

      const req = createMockRequest('POST', '/api/business-canvas', invalidCanvasData);
      const res = createMockResponse();

      await POST(req as NextApiRequest, res as NextApiResponse);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Validation failed',
        })
      );
    });

    it('should handle parent canvas relationships', async () => {
      const canvasWithParent = {
        name: 'Child Canvas',
        description: 'Canvas with parent relationship',
        parentCanvasId: 'parent-canvas-id',
        industry: 'MINING',
      };

      const createdCanvas = global.testUtils.createMockCanvas({
        id: 'child-canvas-id',
        ...canvasWithParent,
      });

      (prisma.businessCanvas.create as jest.Mock).mockResolvedValue(createdCanvas);

      const req = createMockRequest('POST', '/api/business-canvas', canvasWithParent);
      const res = createMockResponse();

      await POST(req as NextApiRequest, res as NextApiResponse);

      expect(prisma.businessCanvas.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          parentCanvasId: 'parent-canvas-id',
        }),
        include: expect.any(Object),
      });
    });

    it('should handle empty parent canvas ID transformation', async () => {
      const canvasWithEmptyParent = {
        name: 'Canvas with Empty Parent',
        description: 'Canvas with empty parent ID',
        parentCanvasId: '', // Empty string should be transformed to null
        industry: 'MINING',
      };

      const createdCanvas = global.testUtils.createMockCanvas({
        id: 'empty-parent-canvas-id',
        ...canvasWithEmptyParent,
        parentCanvasId: null, // Should be transformed to null
      });

      (prisma.businessCanvas.create as jest.Mock).mockResolvedValue(createdCanvas);

      const req = createMockRequest('POST', '/api/business-canvas', canvasWithEmptyParent);
      const res = createMockResponse();

      await POST(req as NextApiRequest, res as NextApiResponse);

      expect(prisma.businessCanvas.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          parentCanvasId: null, // Should be transformed to null
        }),
        include: expect.any(Object),
      });
    });

    it('should handle validation errors for required fields', async () => {
      const invalidCanvasData = {
        // Missing required name field
        description: 'Canvas without name',
        industry: 'MINING',
      };

      const req = createMockRequest('POST', '/api/business-canvas', invalidCanvasData);
      const res = createMockResponse();

      await POST(req as NextApiRequest, res as NextApiResponse);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Validation failed',
        })
      );
    });

    it('should handle database creation errors', async () => {
      const canvasData = {
        name: 'Error Test Canvas',
        industry: 'MINING',
      };

      (prisma.businessCanvas.create as jest.Mock).mockRejectedValue(
        new Error('Unique constraint violation')
      );

      const req = createMockRequest('POST', '/api/business-canvas', canvasData);
      const res = createMockResponse();

      await POST(req as NextApiRequest, res as NextApiResponse);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to create business canvas',
        details: 'Unique constraint violation'
      });
    });
  });

  describe('PATCH /api/business-canvas', () => {
    it('should update business canvas with partial data', async () => {
      const updateData = {
        name: 'Updated Canvas Name',
        status: 'PUBLISHED',
        riskProfile: 'MEDIUM',
      };

      const updatedCanvas = global.testUtils.createMockCanvas({
        id: 'update-canvas-id',
        ...updateData,
      });

      (prisma.businessCanvas.update as jest.Mock).mockResolvedValue(updatedCanvas);

      const req = createMockRequest('PATCH', '/api/business-canvas', updateData);
      const res = createMockResponse();

      await PATCH(req as NextApiRequest, res as NextApiResponse);

      expect(prisma.businessCanvas.update).toHaveBeenCalledWith({
        where: expect.any(Object),
        data: expect.objectContaining(updateData),
        include: expect.any(Object),
      });
      expect(res.json).toHaveBeenCalledWith(updatedCanvas);
    });

    it('should update complex metadata fields', async () => {
      const complexUpdateData = {
        legalName: 'Updated Legal Name Pty Ltd',
        abn: '98765432109',
        sectors: ['OIL_GAS', 'PRODUCTION'],
        operationalStreams: ['EXTRACTION', 'PROCESSING', 'TRANSPORT'],
        strategicObjective: 'Updated strategic objective',
        annualRevenue: 75000000.00,
        employeeCount: 300,
        complianceRequirements: ['WHS', 'ISO14001', 'ICMM', 'ISO45001'],
      };

      const updatedCanvas = global.testUtils.createMockCanvas({
        id: 'complex-update-canvas-id',
        ...complexUpdateData,
      });

      (prisma.businessCanvas.update as jest.Mock).mockResolvedValue(updatedCanvas);

      const req = createMockRequest('PATCH', '/api/business-canvas', complexUpdateData);
      const res = createMockResponse();

      await PATCH(req as NextApiRequest, res as NextApiResponse);

      expect(prisma.businessCanvas.update).toHaveBeenCalledWith({
        where: expect.any(Object),
        data: expect.objectContaining(complexUpdateData),
        include: expect.any(Object),
      });
    });

    it('should handle validation errors for updates', async () => {
      const invalidUpdateData = {
        name: '', // Invalid empty name
        industry: 'INVALID_INDUSTRY', // Invalid industry
        businessType: 'INVALID_TYPE', // Invalid business type
      };

      const req = createMockRequest('PATCH', '/api/business-canvas', invalidUpdateData);
      const res = createMockResponse();

      await PATCH(req as NextApiRequest, res as NextApiResponse);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Validation failed',
        })
      );
    });

    it('should handle canvas not found errors', async () => {
      const updateData = {
        name: 'Non-existent Canvas',
      };

      (prisma.businessCanvas.update as jest.Mock).mockRejectedValue(
        new Error('Record not found')
      );

      const req = createMockRequest('PATCH', '/api/business-canvas', updateData);
      const res = createMockResponse();

      await PATCH(req as NextApiRequest, res as NextApiResponse);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Business canvas not found',
        details: 'Record not found'
      });
    });
  });

  describe('Complex Query Scenarios', () => {
    it('should handle multiple include clauses with enterprise context', async () => {
      const mockCanvases = [
        global.testUtils.createMockCanvas({
          id: 'canvas-1',
          enterpriseId: 'enterprise-1',
          valuePropositions: [{ id: 'vp-1', description: 'Value Prop 1' }],
          customerSegments: [{ id: 'cs-1', name: 'Customer Segment 1' }],
          revenueStreams: [{ id: 'rs-1', type: 'Subscription' }],
          partnerships: [{ id: 'p-1', name: 'Partnership 1' }],
          resources: [{ id: 'r-1', name: 'Resource 1' }],
          activities: [{ id: 'a-1', name: 'Activity 1' }],
          costStructures: [{ id: 'cs-1', description: 'Cost Structure 1' }],
          channels: [{ id: 'c-1', type: 'Direct' }],
        }),
      ];

      (prisma.businessCanvas.findMany as jest.Mock).mockResolvedValue(mockCanvases);

      const req = createMockRequest(
        'GET', 
        '/api/business-canvas?enterpriseId=enterprise-1&include=valuePropositions,customerSegments,revenueStreams,partnerships,resources,activities,costStructures,channels'
      );
      const res = createMockResponse();

      await GET(req as NextApiRequest, res as NextApiResponse);

      expect(prisma.businessCanvas.findMany).toHaveBeenCalledWith({
        where: { enterpriseId: 'enterprise-1' },
        include: {
          valuePropositions: true,
          customerSegments: true,
          revenueStreams: true,
          partnerships: true,
          resources: true,
          activities: true,
          costStructures: true,
          channels: true,
        },
        orderBy: [
          { isActive: 'desc' },
          { updatedAt: 'desc' },
          { name: 'asc' }
        ]
      });
    });

    it('should handle array field validation', async () => {
      const canvasWithArrays = {
        name: 'Array Test Canvas',
        industry: 'MINING',
        sectors: ['COAL', 'PRODUCTION', 'PROCESSING'],
        sectorTypes: ['EXTRACTIVE', 'PROCESSING', 'MANUFACTURING'],
        operationalStreams: ['EXTRACTION', 'PROCESSING', 'TRANSPORT', 'STORAGE'],
        complianceRequirements: ['WHS', 'ISO14001', 'ICMM', 'ISO45001', 'ISO9001'],
        regulatoryFramework: ['Mining Act', 'Environmental Protection', 'Workplace Safety'],
      };

      const createdCanvas = global.testUtils.createMockCanvas({
        id: 'array-canvas-id',
        ...canvasWithArrays,
      });

      (prisma.businessCanvas.create as jest.Mock).mockResolvedValue(createdCanvas);

      const req = createMockRequest('POST', '/api/business-canvas', canvasWithArrays);
      const res = createMockResponse();

      await POST(req as NextApiRequest, res as NextApiResponse);

      expect(prisma.businessCanvas.create).toHaveBeenCalledWith({
        data: expect.objectContaining(canvasWithArrays),
        include: expect.any(Object),
      });
    });

    it('should handle enum field validation', async () => {
      const canvasWithEnums = {
        name: 'Enum Test Canvas',
        industry: 'MINING',
        businessType: 'CORPORATION',
        regional: 'REGIONAL',
        facilityType: 'OPEN_PIT_MINE',
        riskProfile: 'HIGH',
      };

      const createdCanvas = global.testUtils.createMockCanvas({
        id: 'enum-canvas-id',
        ...canvasWithEnums,
      });

      (prisma.businessCanvas.create as jest.Mock).mockResolvedValue(createdCanvas);

      const req = createMockRequest('POST', '/api/business-canvas', canvasWithEnums);
      const res = createMockResponse();

      await POST(req as NextApiRequest, res as NextApiResponse);

      expect(prisma.businessCanvas.create).toHaveBeenCalledWith({
        data: expect.objectContaining(canvasWithEnums),
        include: expect.any(Object),
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle malformed query parameters', async () => {
      const req = createMockRequest('GET', '/api/business-canvas?include=invalid,fields');
      const res = createMockResponse();

      await GET(req as NextApiRequest, res as NextApiResponse);

      // Should handle gracefully without crashing
      expect(prisma.businessCanvas.findMany).toHaveBeenCalled();
    });

    it('should handle empty response arrays', async () => {
      (prisma.businessCanvas.findMany as jest.Mock).mockResolvedValue([]);

      const req = createMockRequest('GET', '/api/business-canvas');
      const res = createMockResponse();

      await GET(req as NextApiRequest, res as NextApiResponse);

      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should handle null values in response', async () => {
      const canvasWithNulls = global.testUtils.createMockCanvas({
        id: 'null-canvas-id',
        description: null,
        legalName: null,
        parentCanvasId: null,
      });

      (prisma.businessCanvas.create as jest.Mock).mockResolvedValue(canvasWithNulls);

      const req = createMockRequest('POST', '/api/business-canvas', {
        name: 'Null Test Canvas',
        industry: 'MINING',
      });
      const res = createMockResponse();

      await POST(req as NextApiRequest, res as NextApiResponse);

      expect(res.json).toHaveBeenCalledWith(canvasWithNulls);
    });

    it('should handle large data sets efficiently', async () => {
      const largeDataSet = global.testUtils.createMultipleCanvases(1000);
      (prisma.businessCanvas.findMany as jest.Mock).mockResolvedValue(largeDataSet);

      const req = createMockRequest('GET', '/api/business-canvas');
      const res = createMockResponse();

      await GET(req as NextApiRequest, res as NextApiResponse);

      expect(res.json).toHaveBeenCalledWith(largeDataSet);
      expect(largeDataSet).toHaveLength(1000);
    });
  });
}); 