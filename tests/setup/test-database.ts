import { PrismaClient } from '@prisma/client';
import { GraphService } from '@/lib/services/graph.service';

export class TestDatabase {
  private prisma: PrismaClient;
  private graphService: GraphService;

  constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
        },
      },
    });
    this.graphService = new GraphService();
  }

  async setup() {
    console.log('Setting up test database...');
    
    // Clean database
    await this.cleanDatabase();
    
    // Seed test data
    await this.seedTestData();
    
    // Setup graph nodes
    await this.setupGraphNodes();
    
    console.log('Test database setup completed');
  }

  async teardown() {
    console.log('Tearing down test database...');
    await this.cleanDatabase();
    await this.prisma.$disconnect();
    console.log('Test database teardown completed');
  }

  private async cleanDatabase() {
    console.log('Cleaning database...');
    
    // Clean in reverse dependency order
    const tables = [
      'edges', 'nodes',
      'business_canvas_facility_types', 'business_canvas_compliance_frameworks', 'business_canvas_operational_streams',
      'pattern_applications', 'assignment_patterns',
      'canvas_exports', 'canvas_sharing_settings', 'canvas_collaborators', 'canvas_versions',
      'value_propositions', 'customer_segments', 'revenue_streams', 'partnerships', 'resources', 'activities', 'cost_structures', 'channels',
      'business_canvases',
      'process_controls', 'process_risks', 'process_metrics', 'process_outputs', 'process_inputs', 'process_steps', 'processes',
      'departments', 'business_units', 'facilities', 'enterprises',
      'master_controls', 'master_hazards', 'master_vendors', 'master_systems', 'master_roles',
      'industry_regulatory_framework_associations', 'industry_compliance_requirement_associations',
      'industry_operational_stream_associations', 'industry_facility_type_associations',
      'industry_compliance_frameworks', 'industry_operational_streams',
      'sectors', 'industry_facility_types', 'industries',
      'operational_streams', 'facility_types', 'compliance_requirements', 'regulatory_frameworks',
      'users',
    ];

    for (const table of tables) {
      try {
        await this.prisma.$executeRaw`TRUNCATE TABLE "${table}" CASCADE`;
      } catch (error) {
        console.warn(`Could not truncate table ${table}:`, error);
      }
    }
  }

  private async seedTestData() {
    console.log('Seeding test data...');
    
    // Seed master data hierarchy
    await this.seedMasterDataHierarchy();
    
    // Seed enterprise data
    await this.seedEnterpriseData();
    
    // Seed business canvas data
    await this.seedBusinessCanvasData();
    
    // Seed process data
    await this.seedProcessData();
  }

  private async setupGraphNodes() {
    console.log('Setting up graph nodes...');
    
    // Create graph nodes for all entities
    await this.createGraphNodes();
    
    // Create graph relationships
    await this.createGraphRelationships();
  }

  private async seedMasterDataHierarchy() {
    console.log('Seeding master data hierarchy...');

    // Create industries
    const miningIndustry = await this.prisma.industry.create({
      data: {
        code: 'MINING_METALS',
        name: 'Mining & Metals',
        description: 'Extractive industries including mining and metals processing',
        category: 'EXTRACTIVE',
        isActive: true,
        sortOrder: 1,
      },
    });

    const oilGasIndustry = await this.prisma.industry.create({
      data: {
        code: 'OIL_GAS',
        name: 'Oil & Gas',
        description: 'Oil and gas extraction and processing',
        category: 'EXTRACTIVE',
        isActive: true,
        sortOrder: 2,
      },
    });

    // Create sectors for mining industry
    const copperSector = await this.prisma.sector.create({
      data: {
        code: 'COPPER',
        name: 'Copper Mining',
        description: 'Copper extraction and processing',
        category: 'COMMODITY',
        riskProfile: 'HIGH',
        industryId: miningIndustry.id,
        isActive: true,
        sortOrder: 1,
      },
    });

    const goldSector = await this.prisma.sector.create({
      data: {
        code: 'GOLD',
        name: 'Gold Mining',
        description: 'Gold extraction and processing',
        category: 'COMMODITY',
        riskProfile: 'HIGH',
        industryId: miningIndustry.id,
        isActive: true,
        sortOrder: 2,
      },
    });

    // Create facility types
    const openPitMine = await this.prisma.facilityTypeMaster.create({
      data: {
        code: 'OPEN_PIT_MINE',
        name: 'Open Pit Mine',
        description: 'Surface mining operations',
        category: 'EXTRACTION',
        riskProfile: 'HIGH',
        isActive: true,
        sortOrder: 1,
      },
    });

    const undergroundMine = await this.prisma.facilityTypeMaster.create({
      data: {
        code: 'UNDERGROUND_MINE',
        name: 'Underground Mine',
        description: 'Subsurface mining operations',
        category: 'EXTRACTION',
        riskProfile: 'CRITICAL',
        isActive: true,
        sortOrder: 2,
      },
    });

    const refinery = await this.prisma.facilityTypeMaster.create({
      data: {
        code: 'REFINERY',
        name: 'Refinery',
        description: 'Mineral processing and refining',
        category: 'PROCESSING',
        riskProfile: 'HIGH',
        isActive: true,
        sortOrder: 3,
      },
    });

    // Create operational streams
    const extractionStream = await this.prisma.operationalStream.create({
      data: {
        code: 'EXTRACTION',
        name: 'Extraction Operations',
        description: 'Mineral extraction and mining operations',
        category: 'EXTRACTION',
        isActive: true,
        sortOrder: 1,
      },
    });

    const processingStream = await this.prisma.operationalStream.create({
      data: {
        code: 'PROCESSING',
        name: 'Processing Operations',
        description: 'Mineral processing and refinement',
        category: 'PROCESSING',
        isActive: true,
        sortOrder: 2,
      },
    });

    const safetyStream = await this.prisma.operationalStream.create({
      data: {
        code: 'SAFETY_SYSTEMS',
        name: 'Safety Systems',
        description: 'Safety management and control systems',
        category: 'SAFETY',
        isActive: true,
        sortOrder: 3,
      },
    });

    // Create compliance requirements
    const iso45001 = await this.prisma.complianceRequirement.create({
      data: {
        code: 'ISO_45001',
        name: 'ISO 45001 - Occupational Health and Safety',
        description: 'International standard for occupational health and safety management',
        category: 'INTERNATIONAL',
        isActive: true,
        sortOrder: 1,
      },
    });

    const whsAct = await this.prisma.complianceRequirement.create({
      data: {
        code: 'WHS_ACT',
        name: 'Work Health and Safety Act',
        description: 'Australian WHS legislation',
        category: 'FEDERAL',
        isActive: true,
        sortOrder: 2,
      },
    });

    // Create regulatory frameworks
    const australianFramework = await this.prisma.regulatoryFramework.create({
      data: {
        code: 'AUSTRALIAN_FRAMEWORK',
        name: 'Australian Regulatory Framework',
        description: 'Comprehensive Australian regulatory framework',
        category: 'NATIONAL',
        isActive: true,
        sortOrder: 1,
      },
    });

    // Create industry associations
    await this.prisma.industryFacilityTypeAssociation.create({
      data: {
        industryId: miningIndustry.id,
        facilityTypeId: openPitMine.id,
        isActive: true,
        sortOrder: 1,
      },
    });

    await this.prisma.industryFacilityTypeAssociation.create({
      data: {
        industryId: miningIndustry.id,
        facilityTypeId: undergroundMine.id,
        isActive: true,
        sortOrder: 2,
      },
    });

    await this.prisma.industryOperationalStreamAssociation.create({
      data: {
        industryId: miningIndustry.id,
        operationalStreamId: extractionStream.id,
        isActive: true,
        sortOrder: 1,
      },
    });

    await this.prisma.industryOperationalStreamAssociation.create({
      data: {
        industryId: miningIndustry.id,
        operationalStreamId: processingStream.id,
        isActive: true,
        sortOrder: 2,
      },
    });

    await this.prisma.industryComplianceRequirementAssociation.create({
      data: {
        industryId: miningIndustry.id,
        complianceRequirementId: iso45001.id,
        isActive: true,
        sortOrder: 1,
      },
    });

    await this.prisma.industryRegulatoryFrameworkAssociation.create({
      data: {
        industryId: miningIndustry.id,
        regulatoryFrameworkId: australianFramework.id,
        isActive: true,
        sortOrder: 1,
      },
    });

    // Create assignment patterns
    await this.prisma.assignmentPattern.create({
      data: {
        name: 'Mining Industry Pattern',
        description: 'Standard pattern for mining industry business canvases',
        industryId: miningIndustry.id,
        sectorId: copperSector.id,
        patternRules: {
          facilityTypes: ['OPEN_PIT_MINE', 'REFINERY'],
          operationalStreams: ['EXTRACTION', 'PROCESSING'],
          complianceRequirements: ['ISO_45001', 'WHS_ACT'],
        },
        isActive: true,
        sortOrder: 1,
      },
    });
  }

  private async seedEnterpriseData() {
    console.log('Seeding enterprise data...');

    // Create test enterprise
    const enterprise = await this.prisma.enterprise.create({
      data: {
        name: 'Test Mining Enterprise',
        legalName: 'Test Mining Enterprise Pty Ltd',
        abn: '12345678901',
        acn: '123456789',
        description: 'Test mining enterprise for testing',
        industry: 'MINING_METALS',
        sector: 'COPPER',
        isActive: true,
      },
    });

    // Create test facility
    const facility = await this.prisma.facility.create({
      data: {
        enterpriseId: enterprise.id,
        name: 'Test Mine Site',
        code: 'TEST001',
        description: 'Test mining facility',
        type: 'MINE',
        status: 'ACTIVE',
        location: 'Queensland, Australia',
        coordinates: '-23.5505,146.8250',
        capacity: '1,000,000 tonnes/year',
        isActive: true,
      },
    });

    // Create test business unit
    const businessUnit = await this.prisma.businessUnit.create({
      data: {
        enterpriseId: enterprise.id,
        facilityId: facility.id,
        name: 'Mining Operations',
        code: 'MINING_OPS',
        description: 'Mining operations business unit',
        type: 'MINING',
        status: 'ACTIVE',
        manager: 'John Smith',
        budget: 50000000.00,
        isActive: true,
      },
    });

    // Create test department
    await this.prisma.department.create({
      data: {
        businessUnitId: businessUnit.id,
        name: 'Safety Department',
        code: 'SAFETY_DEPT',
        description: 'Safety management department',
        type: 'SAFETY',
        status: 'ACTIVE',
        manager: 'Jane Doe',
        employeeCount: 15,
        isActive: true,
      },
    });

    // Create test user
    await this.prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword',
        role: 'ADMIN',
        isActive: true,
        enterpriseId: enterprise.id,
      },
    });
  }

  private async seedBusinessCanvasData() {
    console.log('Seeding business canvas data...');

    const enterprise = await this.prisma.enterprise.findFirst();
    if (!enterprise) throw new Error('Enterprise not found for canvas creation');

    // Create test business canvas
    const canvas = await this.prisma.businessCanvas.create({
      data: {
        name: 'Test Business Canvas',
        description: 'Test business model canvas',
        version: '1.0',
        isActive: true,
        status: 'DRAFT',
        editMode: 'SINGLE_USER',
        autoSave: true,
        enterpriseId: enterprise.id,
        industry: 'MINING_METALS',
        sectors: ['COPPER'],
        primarySector: 'COPPER',
        businessType: 'CORPORATION',
        regional: 'REGIONAL',
        primaryLocation: 'Queensland, Australia',
        coordinates: '-23.5505,146.8250',
        facilityType: 'OPEN_PIT_MINE',
        operationalStreams: ['EXTRACTION', 'PROCESSING'],
        strategicObjective: 'Sustainable mining operations',
        valueProposition: 'High-quality copper for global markets',
        competitiveAdvantage: 'Advanced extraction technology',
        annualRevenue: 100000000.00,
        employeeCount: 200,
        riskProfile: 'MEDIUM',
        complianceRequirements: ['ISO_45001', 'WHS_ACT'],
        regulatoryFramework: ['AUSTRALIAN_FRAMEWORK'],
      },
    });

    // Create canvas sections
    await this.prisma.valueProposition.create({
      data: {
        businessCanvasId: canvas.id,
        description: 'High-quality copper extraction',
        priority: 'HIGH',
      },
    });

    await this.prisma.customerSegment.create({
      data: {
        businessCanvasId: canvas.id,
        name: 'Global Copper Markets',
        description: 'International copper markets',
        size: 1000000,
        priority: 'HIGH',
      },
    });

    await this.prisma.revenueStream.create({
      data: {
        businessCanvasId: canvas.id,
        type: 'Copper Sales',
        description: 'Primary revenue from copper sales',
        estimatedValue: 100000000.00,
        frequency: 'MONTHLY',
      },
    });
  }

  private async seedProcessData() {
    console.log('Seeding process data...');

    const enterprise = await this.prisma.enterprise.findFirst();
    const businessUnit = await this.prisma.businessUnit.findFirst();
    const user = await this.prisma.user.findFirst();

    if (!enterprise || !businessUnit || !user) {
      throw new Error('Required entities not found for process creation');
    }

    // Create test process
    const process = await this.prisma.process.create({
      data: {
        name: 'Safety Management Process',
        description: 'Comprehensive safety management for mining operations',
        version: '1.0',
        status: 'ACTIVE',
        priority: 'HIGH',
        createdById: user.id,
        enterpriseId: enterprise.id,
        businessUnitId: businessUnit.id,
      },
    });

    // Create process steps
    await this.prisma.processStep.create({
      data: {
        processId: process.id,
        name: 'Risk Assessment',
        description: 'Conduct comprehensive risk assessment',
        orderIndex: 1,
        duration: 60,
        responsible: 'Safety Officer',
      },
    });

    await this.prisma.processStep.create({
      data: {
        processId: process.id,
        name: 'Control Implementation',
        description: 'Implement safety controls',
        orderIndex: 2,
        duration: 120,
        responsible: 'Operations Manager',
      },
    });

    // Create process inputs
    await this.prisma.processInput.create({
      data: {
        processId: process.id,
        name: 'Safety Data',
        type: 'DATA',
        description: 'Historical safety data and incident reports',
        required: true,
      },
    });

    // Create process outputs
    await this.prisma.processOutput.create({
      data: {
        processId: process.id,
        name: 'Safety Report',
        type: 'REPORT',
        description: 'Comprehensive safety assessment report',
        quality: 'HIGH',
      },
    });

    // Create process metrics
    await this.prisma.processMetric.create({
      data: {
        processId: process.id,
        name: 'Safety Incidents',
        value: 0,
        unit: 'incidents/month',
        target: 0,
        frequency: 'MONTHLY',
      },
    });

    // Create process risks
    await this.prisma.processRisk.create({
      data: {
        processId: process.id,
        name: 'Equipment Failure',
        description: 'Risk of equipment failure during operations',
        severity: 'HIGH',
        likelihood: 'MEDIUM',
        impact: 'CRITICAL',
      },
    });
  }

  private async createGraphNodes() {
    console.log('Creating graph nodes...');

    // Create nodes for enterprises
    const enterprises = await this.prisma.enterprise.findMany();
    for (const enterprise of enterprises) {
      const graphNode = await this.graphService.createNode({
        type: 'enterprise',
        label: enterprise.name,
        metadata: {
          legalName: enterprise.legalName,
          abn: enterprise.abn,
          industry: enterprise.industry,
          sector: enterprise.sector,
          originalId: enterprise.id,
        },
      });

      await this.prisma.enterprise.update({
        where: { id: enterprise.id },
        data: { 
          graphNodeId: graphNode.id,
          hierarchyPath: enterprise.id
        }
      });
    }

    // Create nodes for facilities
    const facilities = await this.prisma.facility.findMany({
      include: { enterprise: true }
    });
    for (const facility of facilities) {
      const graphNode = await this.graphService.createNode({
        type: 'facility',
        label: facility.name,
        metadata: {
          code: facility.code,
          type: facility.type,
          status: facility.status,
          location: facility.location,
          capacity: facility.capacity,
          originalId: facility.id,
        },
      });

      const hierarchyPath = facility.enterprise 
        ? `${facility.enterprise.id}.${facility.id}`
        : facility.id;

      await this.prisma.facility.update({
        where: { id: facility.id },
        data: { 
          graphNodeId: graphNode.id,
          hierarchyPath
        }
      });
    }

    // Create nodes for business units
    const businessUnits = await this.prisma.businessUnit.findMany({
      include: { 
        enterprise: true,
        facility: true
      }
    });
    for (const unit of businessUnits) {
      const graphNode = await this.graphService.createNode({
        type: 'business_unit',
        label: unit.name,
        metadata: {
          code: unit.code,
          type: unit.type,
          status: unit.status,
          budget: unit.budget,
          originalId: unit.id,
        },
      });

      let hierarchyPath = unit.enterprise.id;
      if (unit.facility) {
        hierarchyPath += `.${unit.facility.id}`;
      }
      hierarchyPath += `.${unit.id}`;

      await this.prisma.businessUnit.update({
        where: { id: unit.id },
        data: { 
          graphNodeId: graphNode.id,
          hierarchyPath
        }
      });
    }

    // Create nodes for business canvases
    const canvases = await this.prisma.businessCanvas.findMany({
      include: {
        enterprise: true,
        facility: true,
        businessUnit: true
      }
    });
    for (const canvas of canvases) {
      const graphNode = await this.graphService.createNode({
        type: 'business_canvas',
        label: canvas.name,
        metadata: {
          description: canvas.description,
          industry: canvas.industry,
          sectors: canvas.sectors,
          status: canvas.status,
          originalId: canvas.id,
        },
      });

      let hierarchyPath = '';
      if (canvas.enterprise) {
        hierarchyPath = canvas.enterprise.id;
        if (canvas.facility) {
          hierarchyPath += `.${canvas.facility.id}`;
        }
        if (canvas.businessUnit) {
          hierarchyPath += `.${canvas.businessUnit.id}`;
        }
      }
      hierarchyPath += `.${canvas.id}`;

      await this.prisma.businessCanvas.update({
        where: { id: canvas.id },
        data: { 
          graphNodeId: graphNode.id,
          hierarchyPath
        }
      });
    }

    // Create nodes for processes
    const processes = await this.prisma.process.findMany({
      include: {
        enterprise: true,
        facility: true,
        businessUnit: true,
        department: true
      }
    });
    for (const process of processes) {
      const graphNode = await this.graphService.createNode({
        type: 'process',
        label: process.name,
        metadata: {
          description: process.description,
          version: process.version,
          status: process.status,
          priority: process.priority,
          originalId: process.id,
        },
      });

      let hierarchyPath = '';
      if (process.enterprise) {
        hierarchyPath = process.enterprise.id;
        if (process.facility) {
          hierarchyPath += `.${process.facility.id}`;
        }
        if (process.businessUnit) {
          hierarchyPath += `.${process.businessUnit.id}`;
        }
        if (process.department) {
          hierarchyPath += `.${process.department.id}`;
        }
      }
      hierarchyPath += `.${process.id}`;

      await this.prisma.process.update({
        where: { id: process.id },
        data: { 
          graphNodeId: graphNode.id,
          hierarchyPath
        }
      });
    }
  }

  private async createGraphRelationships() {
    console.log('Creating graph relationships...');

    // Enterprise -> Facility relationships
    const facilities = await this.prisma.facility.findMany({
      include: { enterprise: true }
    });

    for (const facility of facilities) {
      if (facility.enterprise?.graphNodeId && facility.graphNodeId) {
        await this.graphService.createEdge({
          fromId: facility.enterprise.graphNodeId,
          toId: facility.graphNodeId,
          relationType: 'operates',
          metadata: {
            relationshipType: 'ownership',
            capacity: facility.capacity,
            type: facility.type
          }
        });
      }
    }

    // Enterprise -> Business Canvas relationships
    const canvases = await this.prisma.businessCanvas.findMany({
      include: { enterprise: true }
    });

    for (const canvas of canvases) {
      if (canvas.enterprise?.graphNodeId && canvas.graphNodeId) {
        await this.graphService.createEdge({
          fromId: canvas.enterprise.graphNodeId,
          toId: canvas.graphNodeId,
          relationType: 'strategizes',
          metadata: {
            relationshipType: 'strategic',
            industry: canvas.industry,
            status: canvas.status
          }
        });
      }
    }

    // Business Unit -> Process relationships
    const processes = await this.prisma.process.findMany({
      include: { businessUnit: true }
    });

    for (const process of processes) {
      if (process.businessUnit?.graphNodeId && process.graphNodeId) {
        await this.graphService.createEdge({
          fromId: process.businessUnit.graphNodeId,
          toId: process.graphNodeId,
          relationType: 'executes',
          metadata: {
            relationshipType: 'operational',
            priority: process.priority,
            status: process.status
          }
        });
      }
    }
  }

  // Utility methods for tests
  async getTestData() {
    const enterprise = await this.prisma.enterprise.findFirst({
      include: {
        facilities: {
          include: {
            businessUnits: {
              include: {
                departments: true
              }
            }
          }
        },
        businessCanvases: true,
        processes: true,
      }
    });

    const user = await this.prisma.user.findFirst();
    const industry = await this.prisma.industry.findFirst({
      include: {
        sectors: true,
        facilityTypeAssociations: {
          include: {
            facilityType: true
          }
        },
        operationalStreamAssociations: {
          include: {
            operationalStream: true
          }
        },
      }
    });

    return {
      enterprise,
      user,
      industry,
    };
  }
} 