# CapOpt Platform - Modular Seed Management

## Overview
This directory contains the modular seed management system for the CapOpt Platform. The system is designed to be scalable, maintainable, and environment-aware.

## Test Data Strategy

### Enterprise Information
The platform uses **Cracked Mountain Pty Ltd (CMP)** as the test enterprise, with the **Hercules Levee** facility based on real-world **Olympic Dam Mine (ODM)** operations.

#### Enterprise Structure
- **Enterprise**: Cracked Mountain Pty Ltd
  - **ABN**: 12345678901
  - **Industry**: Mining
  - **Sector**: Resources
  - **Description**: Leading Australian mining and minerals processing company

#### Facility Information
- **Facility**: Hercules Levee (HL001)
  - **Type**: Integrated mining and minerals processing
  - **Location**: Roxby Downs, South Australia
  - **Capacity**: 200,000 tonnes copper, 4,000 tonnes uranium, 80,000 oz gold, 800,000 oz silver annually
  - **Operational Start**: 1988

#### Operational Streams
Based on Olympic Dam operations, the platform supports multiple operational streams:

1. **Copper Stream**
   - Copper Flotation Process
   - Copper Smelting
   - Copper Refining

2. **Uranium Stream**
   - Uranium Leaching
   - Uranium Solvent Extraction
   - Uranium Precipitation

3. **Gold Stream**
   - Gold Recovery from Copper
   - Gold Refining

4. **Silver Stream**
   - Silver Recovery from Copper
   - Silver Refining

#### Business Units
- Mining Operations (MINING)
- Mineral Processing (PROCESSING)
- Metallurgy (METALLURGY)
- Maintenance (MAINTENANCE)
- Engineering (ENGINEERING)
- Safety & Health (SAFETY)
- Environmental (ENVIRONMENTAL)
- Finance (FINANCE)
- Human Resources (HR)
- Information Technology (IT)
- Logistics (LOGISTICS)
- Quality Assurance (QA)

#### Departments
Each business unit contains multiple departments with realistic staffing levels and management structures.

## Directory Structure

```
prisma/seed/
├── index.ts                 # Main seed orchestrator
├── config/
│   ├── environment.ts       # Environment-specific configs
│   ├── constants.ts         # Shared constants
│   └── types.ts            # TypeScript types
├── enterprise/
│   ├── index.ts            # Enterprise seeding orchestrator
│   ├── cracked-mountain.ts # Cracked Mountain Pty Ltd data
│   └── hercules-levee.ts   # Hercules Levee facility data
├── users/
│   ├── index.ts            # User seeding orchestrator
│   ├── admin-users.ts      # Admin user creation
│   └── role-users.ts       # Role-specific users
├── controls/
│   ├── index.ts            # Control layer seeding
│   ├── risk-categories.ts  # Risk categories
│   ├── control-types.ts    # Control types
│   ├── control-effectiveness.ts # Effectiveness ratings
│   └── critical-controls.ts # Critical controls data
├── operational/
│   ├── index.ts            # Operational layer seeding
│   ├── processes.ts        # Basic processes
│   └── operational-streams.ts # Operational streams
└── utils/
    ├── helpers.ts          # Common seeding utilities
    └── cleanup.ts          # Cleanup utilities
```

## Usage

### Basic Seeding
```bash
# Seed all modules
npm run db:seed

# Development seeding
npm run db:seed:dev

# Testing seeding (with cleanup)
npm run db:seed:test
```

### Selective Seeding
```bash
# Seed specific modules
npm run db:seed:enterprise
npm run db:seed:users
npm run db:seed:controls
npm run db:seed:operational
```

### Database Management
```bash
# Clean database
npm run db:clean

# Reset and reseed
npm run db:reset
```

## Environment Configuration

### Development
- Includes test data
- Includes sample data
- No cleanup before seeding

### Testing
- Includes test data
- No sample data
- Cleanup before seeding

### Staging
- No test data
- No sample data
- No cleanup before seeding

## Seed Data Characteristics

### Realistic Test Data
- Based on real-world mining operations (Olympic Dam Mine)
- Includes complex organizational structures
- Multiple operational streams (copper, uranium, gold, silver)
- Realistic business units and departments
- Proper enterprise hierarchy

### Scalability
- Modular structure allows easy expansion
- Environment-aware configuration
- Selective seeding capabilities
- Dependency management

### Data Integrity
- Proper foreign key relationships
- Consistent data across modules
- Validation before seeding
- Cleanup strategies

## Best Practices

1. **Dependency Order**: Always seed in dependency order (enterprise → users → controls → operational)
2. **Data Validation**: Validate data before seeding
3. **Error Handling**: Proper error handling and reporting
4. **Environment Awareness**: Use appropriate data for each environment
5. **Documentation**: Keep documentation updated with data changes

## Adding New Seed Data

1. Create new module directory
2. Implement seed function with proper return type
3. Add to main orchestrator
4. Update documentation
5. Test with different environments

## Troubleshooting

### Common Issues
- **Missing Dependencies**: Ensure parent entities are seeded first
- **Unique Constraints**: Check for existing data before creating
- **Foreign Keys**: Verify all referenced entities exist
- **Environment Variables**: Check configuration settings

### Debug Mode
Set `NODE_ENV=development` for verbose logging and detailed error messages. 