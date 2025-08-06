# Hercules Levee BMC Seeding Plan

## 🎯 **Overview**

This plan outlines the comprehensive seeding of Business Model Canvas (BMC) data for the Hercules Levee facility and its children (departments), plus cleanup of test businesses from the database. Hercules Levee will serve as our detailed, holistic, functional synthetic dataset for development and testing.

## 🏭 **Hercules Levee Facility Context**

### **Facility Details**
- **Name**: Hercules Levee
- **Code**: HL001
- **Type**: Integrated mining and minerals processing facility
- **Location**: Roxby Downs, South Australia
- **Products**: Copper, uranium, gold, silver
- **Capacity**: 200,000 tonnes copper, 4,000 tonnes uranium, 80,000 oz gold, 800,000 oz silver annually
- **Operations**: Underground mining, open pit mining, crushing, flotation, solvent extraction, smelting, refining

### **Organizational Structure**
- **Enterprise**: Cracked Mountain Resources
- **Business Units**: 8 (Mining, Processing, Metallurgy, Maintenance, Engineering, Safety, Environmental, Support)
- **Departments**: 25 departments across all business units

## 🧹 **Database Cleanup Phase**

### **1. Test Business Cleanup**
**Objective**: Remove all test businesses except Hercules Levee

#### **Businesses to Remove**:
- All test business canvases created during development
- Temporary test data
- Sample/demo businesses not related to Hercules Levee

#### **Cleanup Script**:
```typescript
// Remove test business canvases
await prisma.businessCanvas.deleteMany({
  where: {
    name: {
      not: {
        contains: 'Hercules Levee'
      }
    }
  }
})

// Remove associated BMC items
await prisma.valueProposition.deleteMany({
  where: {
    businessCanvas: {
      name: {
        not: {
          contains: 'Hercules Levee'
        }
      }
    }
  }
})
// Repeat for all BMC models
```

### **2. Preserve Hercules Levee Data**
- Keep all Hercules Levee related data
- Keep enterprise structure (Cracked Mountain Resources)
- Keep facility, business units, and departments
- Keep associated users and relationships

## 📊 **BMC Seeding Strategy**

### **1. Enterprise-Level BMC**
**Scope**: Hercules Levee facility as a whole

#### **Value Propositions** (4 items)
1. **Integrated Mining & Processing Excellence**
   - Strategic: World-class integrated mining and processing operations
   - Operational: End-to-end value chain from ore to refined metals
   - Risk: Comprehensive safety and environmental controls
   - Performance: High recovery rates and operational efficiency
   - Compliance: Full regulatory compliance across all operations

2. **Multi-Commodity Production**
   - Strategic: Diversified revenue streams from multiple metals
   - Operational: Advanced processing technology for complex ores
   - Risk: Commodity price hedging and market diversification
   - Performance: Optimized production across all commodities
   - Compliance: Multi-jurisdictional regulatory compliance

3. **Sustainable Resource Development**
   - Strategic: Long-term sustainable mining practices
   - Operational: Environmental stewardship and community engagement
   - Risk: Environmental impact mitigation and rehabilitation
   - Performance: ESG metrics and sustainability reporting
   - Compliance: Environmental protection and rehabilitation standards

4. **Technology & Innovation Leadership**
   - Strategic: Industry-leading technology and innovation
   - Operational: Advanced automation and digital transformation
   - Risk: Technology risk management and cybersecurity
   - Performance: Innovation metrics and technology adoption
   - Compliance: Technology standards and cybersecurity compliance

#### **Customer Segments** (4 items)
1. **Global Metal Traders**
   - Strategic: International metal trading companies
   - Operational: Direct sales and logistics partnerships
   - Risk: Credit risk and market volatility
   - Performance: Customer satisfaction and retention
   - Compliance: International trade regulations

2. **Industrial Manufacturers**
   - Strategic: Copper and precious metals manufacturers
   - Operational: Long-term supply contracts
   - Risk: Supply chain disruption and quality issues
   - Performance: Product quality and delivery reliability
   - Compliance: Quality standards and product specifications

3. **Energy Sector (Uranium)**
   - Strategic: Nuclear power utilities and fuel fabricators
   - Operational: Specialized uranium processing and transport
   - Risk: Nuclear regulatory compliance and security
   - Performance: Nuclear fuel quality and safety
   - Compliance: Nuclear regulatory requirements

4. **Investment & Financial Markets**
   - Strategic: Institutional investors and financial markets
   - Operational: Financial reporting and investor relations
   - Risk: Financial market volatility and investor confidence
   - Performance: Financial performance and shareholder value
   - Compliance: Financial reporting and disclosure requirements

#### **Channels** (4 items)
1. **Direct Sales Channels**
   - Strategic: Direct customer relationships and contracts
   - Operational: Sales team and customer service
   - Risk: Customer concentration and relationship management
   - Performance: Sales effectiveness and customer satisfaction
   - Compliance: Sales and marketing regulations

2. **Commodity Exchanges**
   - Strategic: LME, COMEX, and other commodity exchanges
   - Operational: Trading operations and market access
   - Risk: Market volatility and exchange requirements
   - Performance: Trading efficiency and market access
   - Compliance: Exchange regulations and reporting

3. **Logistics & Transport**
   - Strategic: Rail, road, and port logistics networks
   - Operational: Transport partnerships and infrastructure
   - Risk: Transport disruption and logistics costs
   - Performance: Logistics efficiency and cost management
   - Compliance: Transport and logistics regulations

4. **Digital & Technology Platforms**
   - Strategic: Digital trading platforms and marketplaces
   - Operational: E-commerce and digital customer engagement
   - Risk: Technology disruption and cybersecurity
   - Performance: Digital adoption and customer engagement
   - Compliance: Digital commerce and data protection

#### **Revenue Streams** (4 items)
1. **Copper Sales**
   - Strategic: Primary revenue stream from copper production
   - Operational: Copper processing and sales operations
   - Risk: Copper price volatility and market demand
   - Performance: Copper production and sales volumes
   - Compliance: Copper quality and trading regulations

2. **Uranium Sales**
   - Strategic: Specialized uranium market revenue
   - Operational: Uranium processing and nuclear fuel supply
   - Risk: Nuclear regulatory changes and market restrictions
   - Performance: Uranium production and market share
   - Compliance: Nuclear regulatory and security requirements

3. **Precious Metals Sales**
   - Strategic: Gold and silver by-product revenue
   - Operational: Precious metals refining and sales
   - Risk: Precious metals price volatility
   - Performance: Precious metals recovery and sales
   - Compliance: Precious metals trading and quality standards

4. **Service & Technology Revenue**
   - Strategic: Technology licensing and consulting services
   - Operational: Technology development and service delivery
   - Risk: Technology obsolescence and competition
   - Performance: Service revenue and technology adoption
   - Compliance: Technology licensing and service regulations

#### **Key Resources** (4 items)
1. **Mineral Resources**
   - Strategic: Large-scale mineral resource base
   - Operational: Resource development and mining operations
   - Risk: Resource depletion and geological uncertainty
   - Performance: Resource utilization and development efficiency
   - Compliance: Resource reporting and development regulations

2. **Processing Infrastructure**
   - Strategic: Advanced processing plant and equipment
   - Operational: Processing operations and maintenance
   - Risk: Equipment failure and operational disruption
   - Performance: Processing efficiency and capacity utilization
   - Compliance: Equipment safety and environmental standards

3. **Human Capital**
   - Strategic: Skilled workforce and technical expertise
   - Operational: Workforce management and development
   - Risk: Skills shortage and workforce retention
   - Performance: Workforce productivity and development
   - Compliance: Labor laws and workplace safety

4. **Technology & Innovation**
   - Strategic: Advanced technology and innovation capabilities
   - Operational: Technology development and implementation
   - Risk: Technology obsolescence and cybersecurity
   - Performance: Technology adoption and innovation metrics
   - Compliance: Technology standards and cybersecurity

#### **Key Activities** (4 items)
1. **Mining Operations**
   - Strategic: Underground and open pit mining operations
   - Operational: Mining planning, development, and production
   - Risk: Mining safety and operational risks
   - Performance: Mining productivity and safety metrics
   - Compliance: Mining safety and environmental regulations

2. **Mineral Processing**
   - Strategic: Ore processing and metal extraction
   - Operational: Crushing, grinding, flotation, and extraction
   - Risk: Processing efficiency and recovery rates
   - Performance: Processing recovery and efficiency metrics
   - Compliance: Processing environmental and safety standards

3. **Metal Refining**
   - Strategic: Metal refining and product quality
   - Operational: Smelting, refining, and quality control
   - Risk: Refining quality and operational efficiency
   - Performance: Refining quality and efficiency metrics
   - Compliance: Refining quality and environmental standards

4. **Environmental Management**
   - Strategic: Environmental stewardship and compliance
   - Operational: Environmental monitoring and management
   - Risk: Environmental impact and regulatory compliance
   - Performance: Environmental performance metrics
   - Compliance: Environmental protection regulations

#### **Key Partnerships** (4 items)
1. **Technology Partners**
   - Strategic: Technology development and innovation partnerships
   - Operational: Technology implementation and support
   - Risk: Technology dependency and partnership risks
   - Performance: Technology partnership effectiveness
   - Compliance: Technology licensing and partnership agreements

2. **Logistics Partners**
   - Strategic: Transport and logistics partnerships
   - Operational: Supply chain and distribution networks
   - Risk: Logistics disruption and partnership reliability
   - Performance: Logistics efficiency and cost management
   - Compliance: Transport and logistics regulations

3. **Financial Partners**
   - Strategic: Banking and financial service partnerships
   - Operational: Financial services and risk management
   - Risk: Financial market volatility and credit risk
   - Performance: Financial service effectiveness and cost
   - Compliance: Financial services and banking regulations

4. **Regulatory Partners**
   - Strategic: Government and regulatory relationships
   - Operational: Regulatory compliance and reporting
   - Risk: Regulatory changes and compliance risks
   - Performance: Regulatory compliance and relationship effectiveness
   - Compliance: Regulatory requirements and reporting

#### **Cost Structure** (4 items)
1. **Operational Costs**
   - Strategic: Mining and processing operational costs
   - Operational: Labor, energy, and consumables
   - Risk: Cost inflation and operational efficiency
   - Performance: Cost per tonne and operational efficiency
   - Compliance: Cost reporting and operational standards

2. **Capital Expenditure**
   - Strategic: Infrastructure and equipment investment
   - Operational: Capital project management and execution
   - Risk: Capital cost overruns and project delays
   - Performance: Capital efficiency and project delivery
   - Compliance: Capital project regulations and standards

3. **Environmental & Compliance Costs**
   - Strategic: Environmental management and compliance
   - Operational: Environmental monitoring and rehabilitation
   - Risk: Environmental incidents and regulatory penalties
   - Performance: Environmental compliance and cost efficiency
   - Compliance: Environmental protection and rehabilitation

4. **Technology & Innovation Costs**
   - Strategic: Technology development and innovation
   - Operational: Technology implementation and maintenance
   - Risk: Technology obsolescence and implementation risks
   - Performance: Technology ROI and innovation metrics
   - Compliance: Technology standards and cybersecurity

### **2. Department-Level BMCs**
**Scope**: 25 departments across 8 business units

#### **Mining Business Unit** (3 departments)
1. **Underground Mining Department**
   - Value Propositions: Safe, efficient underground mining operations
   - Customer Segments: Processing plant, mine planning, safety
   - Channels: Direct operations, planning coordination
   - Revenue Streams: Ore production, development services
   - Key Resources: Mining equipment, skilled workforce, ventilation systems
   - Key Activities: Drilling, blasting, loading, hauling, ground support
   - Key Partnerships: Equipment suppliers, contractors, safety consultants
   - Cost Structure: Labor, equipment, consumables, safety systems

2. **Open Pit Mining Department**
   - Value Propositions: Large-scale open pit mining operations
   - Customer Segments: Processing plant, mine planning, environmental
   - Channels: Direct operations, environmental coordination
   - Revenue Streams: Ore production, rehabilitation services
   - Key Resources: Mining equipment, skilled workforce, water management
   - Key Activities: Drilling, blasting, loading, hauling, rehabilitation
   - Key Partnerships: Equipment suppliers, contractors, environmental consultants
   - Cost Structure: Labor, equipment, consumables, environmental management

3. **Mining Planning Department**
   - Value Propositions: Strategic mine planning and optimization
   - Customer Segments: Mining operations, processing, finance
   - Channels: Planning coordination, technical support
   - Revenue Streams: Planning services, optimization consulting
   - Key Resources: Planning software, geological data, technical expertise
   - Key Activities: Mine design, scheduling, optimization, reporting
   - Key Partnerships: Software vendors, consultants, technical experts
   - Cost Structure: Software licenses, consulting, technical staff

#### **Processing Business Unit** (3 departments)
1. **Crushing & Grinding Department**
   - Value Propositions: Efficient ore size reduction and preparation
   - Customer Segments: Flotation, environmental, maintenance
   - Channels: Direct operations, maintenance coordination
   - Revenue Streams: Ore processing, maintenance services
   - Key Resources: Crushers, mills, conveyors, control systems
   - Key Activities: Crushing, grinding, screening, conveying
   - Key Partnerships: Equipment suppliers, maintenance contractors
   - Cost Structure: Equipment, energy, maintenance, consumables

2. **Flotation Department**
   - Value Propositions: Copper and precious metals separation
   - Customer Segments: Solvent extraction, metallurgy, quality control
   - Channels: Direct operations, quality coordination
   - Revenue Streams: Concentrate production, quality services
   - Key Resources: Flotation cells, reagents, control systems
   - Key Activities: Conditioning, flotation, dewatering, control
   - Key Partnerships: Reagent suppliers, equipment manufacturers
   - Cost Structure: Reagents, energy, maintenance, quality control

3. **Solvent Extraction Department**
   - Value Propositions: Uranium and copper solvent extraction
   - Customer Segments: Metallurgy, environmental, nuclear compliance
   - Channels: Direct operations, nuclear compliance coordination
   - Revenue Streams: Uranium concentrate, copper solution
   - Key Resources: Extraction equipment, solvents, control systems
   - Key Activities: Extraction, stripping, solvent recovery, control
   - Key Partnerships: Solvent suppliers, nuclear consultants
   - Cost Structure: Solvents, energy, nuclear compliance, maintenance

#### **Metallurgy Business Unit** (3 departments)
1. **Smelting Department**
   - Value Propositions: Copper smelting and matte production
   - Customer Segments: Refining, environmental, energy
   - Channels: Direct operations, environmental coordination
   - Revenue Streams: Matte production, energy recovery
   - Key Resources: Smelting furnaces, energy systems, control systems
   - Key Activities: Smelting, slag handling, energy recovery, control
   - Key Partnerships: Energy suppliers, equipment manufacturers
   - Cost Structure: Energy, consumables, maintenance, environmental

2. **Refining Department**
   - Value Propositions: High-purity copper and precious metals
   - Customer Segments: Sales, quality control, customers
   - Channels: Direct operations, quality coordination
   - Revenue Streams: Refined metals, quality certification
   - Key Resources: Refining equipment, quality systems, expertise
   - Key Activities: Electrorefining, precious metals recovery, quality control
   - Key Partnerships: Equipment suppliers, quality consultants
   - Cost Structure: Equipment, energy, quality control, maintenance

3. **Uranium Processing Department**
   - Value Propositions: Nuclear-grade uranium concentrate
   - Customer Segments: Nuclear fuel fabricators, nuclear compliance
   - Channels: Direct operations, nuclear compliance coordination
   - Revenue Streams: Uranium concentrate, nuclear services
   - Key Resources: Processing equipment, nuclear expertise, compliance systems
   - Key Activities: Concentration, purification, packaging, compliance
   - Key Partnerships: Nuclear consultants, equipment suppliers
   - Cost Structure: Nuclear compliance, equipment, expertise, security

#### **Maintenance Business Unit** (3 departments)
1. **Mechanical Maintenance Department**
   - Value Propositions: Reliable mechanical equipment maintenance
   - Customer Segments: All operational departments, reliability
   - Channels: Direct maintenance, preventive programs
   - Revenue Streams: Maintenance services, reliability improvements
   - Key Resources: Maintenance equipment, skilled technicians, spare parts
   - Key Activities: Preventive maintenance, repairs, overhauls, inspections
   - Key Partnerships: Equipment suppliers, contractors, parts suppliers
   - Cost Structure: Labor, parts, equipment, training

2. **Electrical Maintenance Department**
   - Value Propositions: Electrical and instrumentation reliability
   - Customer Segments: All operational departments, automation
   - Channels: Direct maintenance, automation support
   - Revenue Streams: Maintenance services, automation improvements
   - Key Resources: Electrical equipment, skilled technicians, control systems
   - Key Activities: Electrical maintenance, instrumentation, automation, testing
   - Key Partnerships: Electrical suppliers, automation vendors, contractors
   - Cost Structure: Labor, parts, equipment, training

3. **Reliability Engineering Department**
   - Value Propositions: Predictive maintenance and reliability optimization
   - Customer Segments: All maintenance departments, operations
   - Channels: Engineering support, predictive programs
   - Revenue Streams: Engineering services, reliability improvements
   - Key Resources: Engineering expertise, predictive tools, data systems
   - Key Activities: Reliability analysis, predictive maintenance, optimization
   - Key Partnerships: Engineering consultants, software vendors
   - Cost Structure: Engineering staff, software, consulting, training

#### **Engineering Business Unit** (2 departments)
1. **Process Engineering Department**
   - Value Propositions: Process optimization and technical support
   - Customer Segments: All operational departments, management
   - Channels: Engineering support, technical coordination
   - Revenue Streams: Engineering services, process improvements
   - Key Resources: Engineering expertise, modeling tools, technical data
   - Key Activities: Process analysis, optimization, technical support, projects
   - Key Partnerships: Engineering consultants, technology vendors
   - Cost Structure: Engineering staff, software, consulting, projects

2. **Project Engineering Department**
   - Value Propositions: Capital project delivery and engineering design
   - Customer Segments: All departments, management, external stakeholders
   - Channels: Project management, engineering coordination
   - Revenue Streams: Project services, engineering design
   - Key Resources: Project expertise, design tools, project management systems
   - Key Activities: Project planning, design, execution, commissioning
   - Key Partnerships: Engineering consultants, contractors, suppliers
   - Cost Structure: Project staff, consulting, contractors, equipment

#### **Safety Business Unit** (2 departments)
1. **Safety Operations Department**
   - Value Propositions: Operational safety management and compliance
   - Customer Segments: All operational departments, regulatory bodies
   - Channels: Safety coordination, regulatory liaison
   - Revenue Streams: Safety services, compliance support
   - Key Resources: Safety expertise, safety systems, regulatory knowledge
   - Key Activities: Safety management, incident investigation, training, compliance
   - Key Partnerships: Safety consultants, regulatory bodies, training providers
   - Cost Structure: Safety staff, systems, training, compliance

2. **Occupational Health Department**
   - Value Propositions: Occupational health and hygiene management
   - Customer Segments: All departments, employees, regulatory bodies
   - Channels: Health coordination, medical support
   - Revenue Streams: Health services, medical support
   - Key Resources: Medical expertise, health systems, monitoring equipment
   - Key Activities: Health monitoring, medical support, hygiene management
   - Key Partnerships: Medical providers, health consultants, regulatory bodies
   - Cost Structure: Medical staff, equipment, services, compliance

#### **Environmental Business Unit** (2 departments)
1. **Environmental Management Department**
   - Value Propositions: Environmental compliance and stewardship
   - Customer Segments: All departments, regulatory bodies, community
   - Channels: Environmental coordination, regulatory liaison
   - Revenue Streams: Environmental services, compliance support
   - Key Resources: Environmental expertise, monitoring systems, compliance knowledge
   - Key Activities: Environmental monitoring, compliance, reporting, rehabilitation
   - Key Partnerships: Environmental consultants, regulatory bodies, community
   - Cost Structure: Environmental staff, monitoring, compliance, rehabilitation

2. **Water Management Department**
   - Value Propositions: Water treatment and management services
   - Customer Segments: All departments, environmental, community
   - Channels: Water coordination, treatment operations
   - Revenue Streams: Water services, treatment operations
   - Key Resources: Water treatment equipment, expertise, monitoring systems
   - Key Activities: Water treatment, monitoring, management, compliance
   - Key Partnerships: Water consultants, equipment suppliers, regulatory bodies
   - Cost Structure: Treatment equipment, operations, monitoring, compliance

#### **Support Functions** (8 departments)
1. **Finance Operations Department**
2. **HR Operations Department**
3. **IT Operations Department**
4. **Supply Chain Department**
5. **Quality Control Department**

## 🛠 **Implementation Plan**

### **Phase 1: Database Cleanup** (1 day)
1. **Create cleanup script**
   - Remove test business canvases
   - Remove associated BMC items
   - Preserve Hercules Levee data
   - Verify cleanup results

2. **Execute cleanup**
   - Run cleanup script
   - Verify data integrity
   - Document cleanup results

### **Phase 2: Enterprise BMC Seeding** (2 days)
1. **Create enterprise BMC seeding script**
   - Define all 9 BMC sections with 4 items each
   - Include all enhanced fields (strategic, operational, risk, performance, compliance)
   - Link to Hercules Levee facility

2. **Execute enterprise seeding**
   - Run enterprise BMC seeding
   - Verify data creation
   - Test UI functionality

### **Phase 3: Department BMC Seeding** (3 days)
1. **Create department BMC seeding script**
   - Define BMC items for each of 25 departments
   - Include department-specific context and relationships
   - Link to parent enterprise BMC

2. **Execute department seeding**
   - Run department BMC seeding in batches
   - Verify data creation and relationships
   - Test UI functionality

### **Phase 4: Testing & Validation** (1 day)
1. **Comprehensive testing**
   - Test all BMC sections in UI
   - Verify data relationships
   - Test form functionality
   - Validate data integrity

2. **Documentation**
   - Document seeded data structure
   - Create data dictionary
   - Update seeding documentation

## 📋 **Success Criteria**

### **Database Cleanup**
- ✅ All test businesses removed
- ✅ Hercules Levee data preserved
- ✅ Data integrity maintained

### **Enterprise BMC**
- ✅ All 9 BMC sections seeded (36 items total)
- ✅ All enhanced fields populated
- ✅ Proper relationships established

### **Department BMCs**
- ✅ All 25 departments have BMC data
- ✅ Department-specific context included
- ✅ Parent-child relationships established

### **Data Quality**
- ✅ Realistic and comprehensive data
- ✅ Proper field types and validation
- ✅ Consistent data structure

### **UI Functionality**
- ✅ All BMC sections display correctly
- ✅ Forms work with seeded data
- ✅ Relationships display properly

## 🎯 **Expected Outcomes**

### **1. Comprehensive Test Dataset**
- Complete Hercules Levee BMC data
- Realistic mining industry context
- All enhanced fields populated

### **2. Development & Testing Environment**
- Clean database with focused test data
- Comprehensive synthetic dataset
- Realistic business scenarios

### **3. Documentation & Training**
- Complete data dictionary
- Seeding documentation
- Training materials

---

**Timeline**: 7 days total  
**Priority**: **HIGH** - Foundation for development and testing  
**Dependencies**: Database schema updates completed 