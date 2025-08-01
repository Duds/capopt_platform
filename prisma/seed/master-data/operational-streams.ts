import { PrismaClient } from '@prisma/client'

export async function seedOperationalStreams(prisma: PrismaClient) {
  console.log('🔄 Seeding master operational streams...')

  const operationalStreams = [
    // Extraction
    { code: 'OPEN_PIT_MINING', name: 'Open Pit Mining', category: 'EXTRACTION' },
    { code: 'UNDERGROUND_MINING', name: 'Underground Mining', category: 'EXTRACTION' },
    { code: 'IN_SITU_LEACHING', name: 'In-Situ Leaching', category: 'EXTRACTION' },
    { code: 'DRILLING_OPERATIONS', name: 'Drilling Operations', category: 'EXTRACTION' },
    { code: 'WELL_OPERATIONS', name: 'Well Operations', category: 'EXTRACTION' },
    { code: 'SEISMIC_SURVEYING', name: 'Seismic Surveying', category: 'EXTRACTION' },
    { code: 'WELL_TESTING', name: 'Well Testing', category: 'EXTRACTION' },
    { code: 'RESERVOIR_ANALYSIS', name: 'Reservoir Analysis', category: 'EXTRACTION' },
    { code: 'PRODUCTION_OPTIMIZATION', name: 'Production Optimization', category: 'EXTRACTION' },
    { code: 'ARTIFICIAL_LIFT', name: 'Artificial Lift', category: 'EXTRACTION' },
    
    // Processing
    { code: 'ORE_PROCESSING', name: 'Ore Processing', category: 'PROCESSING' },
    { code: 'CONCENTRATE_PRODUCTION', name: 'Concentrate Production', category: 'PROCESSING' },
    { code: 'SMELTING_OPERATIONS', name: 'Smelting Operations', category: 'PROCESSING' },
    { code: 'REFINING_OPERATIONS', name: 'Refining Operations', category: 'PROCESSING' },
    { code: 'HEAP_LEACHING', name: 'Heap Leaching', category: 'PROCESSING' },
    { code: 'CYANIDATION', name: 'Cyanidation', category: 'PROCESSING' },
    { code: 'GRAVITY_CONCENTRATION', name: 'Gravity Concentration', category: 'PROCESSING' },
    { code: 'CRUDE_OIL_PROCESSING', name: 'Crude Oil Processing', category: 'PROCESSING' },
    { code: 'DISTILLATION', name: 'Distillation', category: 'PROCESSING' },
    { code: 'CRACKING_OPERATIONS', name: 'Cracking Operations', category: 'PROCESSING' },
    { code: 'PRODUCT_BLENDING', name: 'Product Blending', category: 'PROCESSING' },
    { code: 'CHEMICAL_MANUFACTURING', name: 'Chemical Manufacturing', category: 'PROCESSING' },
    { code: 'ASSEMBLY_OPERATIONS', name: 'Assembly Operations', category: 'PROCESSING' },
    { code: 'FABRICATION_OPERATIONS', name: 'Fabrication Operations', category: 'PROCESSING' },
    
    // Safety
    { code: 'SAFETY_SYSTEMS', name: 'Safety Systems', category: 'SAFETY' },
    { code: 'RADIATION_SAFETY', name: 'Radiation Safety', category: 'SAFETY' },
    { code: 'NUCLEAR_COMPLIANCE', name: 'Nuclear Compliance', category: 'SAFETY' },
    { code: 'EMERGENCY_RESPONSE', name: 'Emergency Response', category: 'SAFETY' },
    { code: 'SECURITY_SYSTEMS', name: 'Security Systems', category: 'SAFETY' },
    { code: 'TRANSPORT_SECURITY', name: 'Transport Security', category: 'SAFETY' },
    { code: 'SECURITY_CLEARANCES', name: 'Security Clearances', category: 'SAFETY' },
    { code: 'RADIATION_MONITORING', name: 'Radiation Monitoring', category: 'SAFETY' },
    
    // Environmental
    { code: 'ENVIRONMENTAL_MONITORING', name: 'Environmental Monitoring', category: 'ENVIRONMENTAL' },
    { code: 'TAILINGS_MANAGEMENT', name: 'Tailings Management', category: 'ENVIRONMENTAL' },
    { code: 'WATER_MANAGEMENT', name: 'Water Management', category: 'ENVIRONMENTAL' },
    { code: 'DUST_CONTROL', name: 'Dust Control', category: 'ENVIRONMENTAL' },
    { code: 'WASTE_MANAGEMENT', name: 'Waste Management', category: 'ENVIRONMENTAL' },
    { code: 'REHABILITATION', name: 'Rehabilitation', category: 'ENVIRONMENTAL' },
    { code: 'ENVIRONMENTAL_ASSESSMENT', name: 'Environmental Assessment', category: 'ENVIRONMENTAL' },
    { code: 'ENVIRONMENTAL_MANAGEMENT', name: 'Environmental Management', category: 'ENVIRONMENTAL' },
    { code: 'NOISE_MANAGEMENT', name: 'Noise Management', category: 'ENVIRONMENTAL' },
    
    // Logistics
    { code: 'TRANSPORT_LOGISTICS', name: 'Transport & Logistics', category: 'LOGISTICS' },
    { code: 'STORAGE_MANAGEMENT', name: 'Storage Management', category: 'LOGISTICS' },
    { code: 'PORT_OPERATIONS', name: 'Port Operations', category: 'LOGISTICS' },
    { code: 'TERMINAL_OPERATIONS', name: 'Terminal Operations', category: 'LOGISTICS' },
    { code: 'CHAIN_OF_CUSTODY', name: 'Chain of Custody', category: 'LOGISTICS' },
    { code: 'PIPELINE_OPERATIONS', name: 'Pipeline Operations', category: 'LOGISTICS' },
    { code: 'DISTRIBUTION_OPERATIONS', name: 'Distribution Operations', category: 'LOGISTICS' },
    
    // Quality
    { code: 'QUALITY_CONTROL', name: 'Quality Control', category: 'QUALITY' },
    { code: 'ASSAY_LABORATORY', name: 'Assay Laboratory', category: 'QUALITY' },
    { code: 'PRODUCT_BLENDING_QC', name: 'Product Blending QC', category: 'QUALITY' },
    { code: 'TESTING_CERTIFICATION', name: 'Testing & Certification', category: 'QUALITY' },
    
    // Maintenance
    { code: 'EQUIPMENT_MAINTENANCE', name: 'Equipment Maintenance', category: 'MAINTENANCE' },
    { code: 'WELL_MAINTENANCE', name: 'Well Maintenance', category: 'MAINTENANCE' },
    { code: 'FACILITY_UPKEEP', name: 'Facility Upkeep', category: 'MAINTENANCE' },
    { code: 'PREVENTIVE_MAINTENANCE', name: 'Preventive Maintenance', category: 'MAINTENANCE' },
    { code: 'PRODUCTION_MONITORING', name: 'Production Monitoring', category: 'MAINTENANCE' },
    
    // Research & Development
    { code: 'RESEARCH_DEVELOPMENT', name: 'Research & Development', category: 'RESEARCH' },
    { code: 'TECHNOLOGY_RESEARCH', name: 'Technology Research', category: 'RESEARCH' },
    { code: 'PRODUCT_DEVELOPMENT', name: 'Product Development', category: 'RESEARCH' },
    { code: 'MEDICAL_RESEARCH', name: 'Medical Research', category: 'RESEARCH' },
    { code: 'DEFENCE_RESEARCH', name: 'Defence Research', category: 'RESEARCH' },
    { code: 'DEFENCE_DEVELOPMENT', name: 'Defence Development', category: 'RESEARCH' },
    
    // Services
    { code: 'TECHNOLOGY_SERVICES', name: 'Technology Services', category: 'SERVICES' },
    { code: 'CLOUD_COMPUTING', name: 'Cloud Computing', category: 'SERVICES' },
    { code: 'HEALTHCARE_SERVICES', name: 'Healthcare Services', category: 'SERVICES' },
    { code: 'AVIATION_SERVICES', name: 'Aviation Services', category: 'SERVICES' },
    { code: 'MARINE_SERVICES', name: 'Marine Services', category: 'SERVICES' },
    { code: 'CONSTRUCTION_OPERATIONS', name: 'Construction Operations', category: 'SERVICES' },
    { code: 'PROJECT_MANAGEMENT', name: 'Project Management', category: 'SERVICES' },
    { code: 'ARCHITECTURAL_DESIGN', name: 'Architectural Design', category: 'SERVICES' }
  ]

  for (const stream of operationalStreams) {
    await prisma.operationalStream.upsert({
      where: { code: stream.code },
      update: stream,
      create: stream
    })
  }

  console.log(`✅ Created ${operationalStreams.length} operational streams`)
} 