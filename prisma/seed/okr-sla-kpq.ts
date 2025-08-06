import { PrismaClient } from '@prisma/client'
import { OKRStatus, SLAStatus, KPQStatus, KPQCategory, MetricStatus } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedOKRSLAKPQ() {
  console.log('🎯 Seeding OKR/SLA/KPQ master data...')

  try {
    // Get existing entities for linking
    const businessCanvas = await prisma.businessCanvas.findFirst()
    const operatingModel = await prisma.operatingModel.findFirst()
    const criticalControl = await prisma.criticalControl.findFirst()
    const process = await prisma.process.findFirst()
    const playbook = await prisma.playbook.findFirst()

    // ============================================================================
    // SEED OKRs (Objectives and Key Results)
    // ============================================================================

    console.log('📋 Creating OKRs...')

    const okrs = await Promise.all([
      // Strategic OKR - Safety Excellence
      prisma.oKR.create({
        data: {
          title: 'Zero Harm Safety Excellence',
          description: 'Achieve world-class safety performance with zero fatalities and serious injuries',
          objective: 'Establish industry-leading safety culture and performance',
          keyResults: [
            'Zero fatalities and serious injuries',
            '90% reduction in lost time injuries',
            '100% critical control verification compliance',
            'Safety culture survey score >85%'
          ],
          period: 'FY2025',
          status: OKRStatus.ACTIVE,
          priority: 'HIGH',
          owner: 'Safety Director',
          targetDate: new Date('2025-12-31'),
          metadata: {
            strategicPillar: 'Safety Excellence',
            industryBenchmark: 'ICMM Leading Practice',
            riskCategory: 'Critical',
            stakeholders: ['Workforce', 'Regulators', 'Community']
          },
          businessCanvasId: businessCanvas?.id,
          operatingModelId: operatingModel?.id,
          criticalControlId: criticalControl?.id,
          processId: process?.id
        }
      }),

      // Operational OKR - Process Efficiency
      prisma.oKR.create({
        data: {
          title: 'Operational Excellence & Efficiency',
          description: 'Optimize operational processes for maximum efficiency and reliability',
          objective: 'Achieve 95% operational efficiency across all critical processes',
          keyResults: [
            '95% overall equipment effectiveness (OEE)',
            '30% reduction in process cycle times',
            '99.5% on-time delivery performance',
            '25% reduction in operational costs'
          ],
          period: 'Q3-2025',
          status: OKRStatus.ACTIVE,
          priority: 'HIGH',
          owner: 'Operations Director',
          targetDate: new Date('2025-09-30'),
          metadata: {
            strategicPillar: 'Operational Excellence',
            focusArea: 'Process Optimization',
            kpiCategory: 'Efficiency',
            improvementTarget: 'Continuous'
          },
          businessCanvasId: businessCanvas?.id,
          operatingModelId: operatingModel?.id,
          processId: process?.id
        }
      }),

      // Financial OKR - Cost Management
      prisma.oKR.create({
        data: {
          title: 'Sustainable Cost Leadership',
          description: 'Achieve sustainable cost leadership while maintaining quality and safety standards',
          objective: 'Reduce total cost of operations by 15% while maintaining performance',
          keyResults: [
            '15% reduction in total operating costs',
            '20% improvement in cost per tonne',
            '10% reduction in energy consumption',
            'Maintain quality standards at 99.5%'
          ],
          period: 'FY2025',
          status: OKRStatus.ACTIVE,
          priority: 'MEDIUM',
          owner: 'Finance Director',
          targetDate: new Date('2025-12-31'),
          metadata: {
            strategicPillar: 'Financial Performance',
            costCategory: 'Operational Efficiency',
            sustainability: 'Environmental Impact',
            qualityMaintenance: 'Required'
          },
          businessCanvasId: businessCanvas?.id,
          operatingModelId: operatingModel?.id
        }
      })
    ])

    // ============================================================================
    // SEED SLAs (Service Level Agreements)
    // ============================================================================

    console.log('📊 Creating SLAs...')

    const slas = await Promise.all([
      // Safety SLA
      prisma.sLA.create({
        data: {
          title: 'Critical Control Verification SLA',
          description: 'Ensure timely verification of all critical controls',
          service: 'Critical Control Verification',
          target: 'Daily verification',
          acceptableLapse: '1 day',
          measurementUnit: 'days',
          status: SLAStatus.ACTIVE,
          priority: 'CRITICAL',
          owner: 'Control Room Operator',
          reviewPeriod: 'Weekly',
          metadata: {
            controlCategory: 'Safety Critical',
            verificationMethod: 'Automated + Manual',
            escalationProcess: 'Immediate',
            complianceFramework: 'ICMM'
          },
          businessCanvasId: businessCanvas?.id,
          criticalControlId: criticalControl?.id,
          processId: process?.id
        }
      }),

      // Process SLA
      prisma.sLA.create({
        data: {
          title: 'Process Response Time SLA',
          description: 'Maintain optimal response times for critical processes',
          service: 'Process Response',
          target: 'Within 10 minutes',
          acceptableLapse: '5 minutes',
          measurementUnit: 'minutes',
          status: SLAStatus.ACTIVE,
          priority: 'HIGH',
          owner: 'Process Engineer',
          reviewPeriod: 'Monthly',
          metadata: {
            processType: 'Critical Operations',
            responseCategory: 'Emergency',
            monitoringMethod: 'Real-time',
            alertThreshold: '8 minutes'
          },
          businessCanvasId: businessCanvas?.id,
          processId: process?.id
        }
      }),

      // Quality SLA
      prisma.sLA.create({
        data: {
          title: 'Quality Assurance SLA',
          description: 'Ensure product quality meets specified standards',
          service: 'Quality Assurance',
          target: '99.5% compliance',
          acceptableLapse: '0.2%',
          measurementUnit: 'percentage',
          status: SLAStatus.ACTIVE,
          priority: 'HIGH',
          owner: 'Quality Manager',
          reviewPeriod: 'Weekly',
          metadata: {
            qualityStandard: 'ISO 9001',
            testingFrequency: 'Continuous',
            samplingMethod: 'Statistical',
            correctiveAction: 'Immediate'
          },
          businessCanvasId: businessCanvas?.id,
          processId: process?.id
        }
      })
    ])

    // ============================================================================
    // SEED KPQs (Key Performance Questions)
    // ============================================================================

    console.log('❓ Creating KPQs...')

    const kpqs = await Promise.all([
      // Safety KPQ
      prisma.kPQ.create({
        data: {
          question: 'Are frontline operators authorized to override shutdown protocols if sensors trip?',
          description: 'Assess operator authority and decision-making capabilities in emergency situations',
          scope: 'Tailings Risk Response',
          category: KPQCategory.SAFETY,
          status: KPQStatus.ACTIVE,
          priority: 'CRITICAL',
          owner: 'Safety Manager',
          lastTested: new Date('2025-06-20'),
          nextTestDue: new Date('2025-09-20'),
          metadata: {
            riskLevel: 'Critical',
            testingMethod: 'Scenario-based',
            competencyRequired: 'Advanced',
            regulatoryRequirement: 'Yes'
          },
          businessCanvasId: businessCanvas?.id,
          criticalControlId: criticalControl?.id,
          processId: process?.id,
          playbookId: playbook?.id
        }
      }),

      // Operational KPQ
      prisma.kPQ.create({
        data: {
          question: 'Can the site isolate inflows within 10 minutes of an emergency alert?',
          description: 'Verify emergency response capability for inflow isolation',
          scope: 'Emergency Response',
          category: KPQCategory.OPERATIONAL,
          status: KPQStatus.ACTIVE,
          priority: 'HIGH',
          owner: 'Operations Manager',
          lastTested: new Date('2025-07-15'),
          nextTestDue: new Date('2025-10-15'),
          metadata: {
            responseTime: '10 minutes',
            isolationMethod: 'Automated + Manual',
            backupSystems: 'Redundant',
            trainingFrequency: 'Quarterly'
          },
          businessCanvasId: businessCanvas?.id,
          processId: process?.id,
          playbookId: playbook?.id
        }
      }),

      // Compliance KPQ
      prisma.kPQ.create({
        data: {
          question: 'Are all regulatory reporting requirements being met on time and accurately?',
          description: 'Assess compliance with regulatory reporting obligations',
          scope: 'Regulatory Compliance',
          category: KPQCategory.COMPLIANCE,
          status: KPQStatus.ACTIVE,
          priority: 'HIGH',
          owner: 'Compliance Officer',
          lastTested: new Date('2025-08-01'),
          nextTestDue: new Date('2025-11-01'),
          metadata: {
            regulatoryFramework: 'Multiple',
            reportingFrequency: 'Various',
            accuracyRequirement: '100%',
            auditTrail: 'Required'
          },
          businessCanvasId: businessCanvas?.id,
          processId: process?.id
        }
      }),

      // Assurance KPQ
      prisma.kPQ.create({
        data: {
          question: 'Is the control room staff adequately trained and competent for all emergency scenarios?',
          description: 'Evaluate control room staff competency and training effectiveness',
          scope: 'Control Room Operations',
          category: KPQCategory.ASSURANCE,
          status: KPQStatus.ACTIVE,
          priority: 'HIGH',
          owner: 'Training Manager',
          lastTested: new Date('2025-07-30'),
          nextTestDue: new Date('2025-10-30'),
          metadata: {
            competencyFramework: 'Defined',
            trainingMethod: 'Classroom + Simulation',
            assessmentType: 'Practical + Theory',
            recertificationPeriod: 'Annual'
          },
          businessCanvasId: businessCanvas?.id,
          processId: process?.id,
          playbookId: playbook?.id
        }
      })
    ])

    // ============================================================================
    // CREATE GRAPH NODES FOR OKR/SLA/KPQ
    // ============================================================================

    console.log('🕸️ Creating graph nodes...')

    // Create graph nodes for OKRs
    for (const okr of okrs) {
      const graphNode = await prisma.node.create({
        data: {
          type: 'okr',
          label: okr.title,
          metadata: {
            objective: okr.objective,
            keyResults: okr.keyResults,
            period: okr.period,
            status: okr.status,
            priority: okr.priority
          }
        }
      })

      await prisma.oKR.update({
        where: { id: okr.id },
        data: { graphNodeId: graphNode.id }
      })

      // Update the okr object with the graph node ID
      okr.graphNodeId = graphNode.id
    }

    // Create graph nodes for SLAs
    for (const sla of slas) {
      const graphNode = await prisma.node.create({
        data: {
          type: 'sla',
          label: sla.title,
          metadata: {
            service: sla.service,
            target: sla.target,
            acceptableLapse: sla.acceptableLapse,
            measurementUnit: sla.measurementUnit,
            status: sla.status
          }
        }
      })

      await prisma.sLA.update({
        where: { id: sla.id },
        data: { graphNodeId: graphNode.id }
      })

      // Update the sla object with the graph node ID
      sla.graphNodeId = graphNode.id
    }

    // Create graph nodes for KPQs
    for (const kpq of kpqs) {
      const graphNode = await prisma.node.create({
        data: {
          type: 'kpq',
          label: kpq.question.substring(0, 50) + '...',
          metadata: {
            question: kpq.question,
            scope: kpq.scope,
            category: kpq.category,
            status: kpq.status,
            lastTested: kpq.lastTested,
            nextTestDue: kpq.nextTestDue
          }
        }
      })

      await prisma.kPQ.update({
        where: { id: kpq.id },
        data: { graphNodeId: graphNode.id }
      })

      // Update the kpq object with the graph node ID
      kpq.graphNodeId = graphNode.id
    }

    // ============================================================================
    // CREATE GRAPH RELATIONSHIPS
    // ============================================================================

    console.log('🔗 Creating graph relationships...')

    // OKR → Critical Control relationships
    if (okrs[0] && criticalControl) {
      // Get the critical control's graph node
      const criticalControlNode = await prisma.node.findFirst({
        where: { id: criticalControl.graphNodeId || '' }
      })
      
      if (criticalControlNode) {
        await prisma.edge.create({
          data: {
            fromId: okrs[0].graphNodeId!,
            toId: criticalControlNode.id,
            relationType: 'drives',
            metadata: {
              impactLevel: 'high',
              expectedOutcome: '90% control verification rate',
              strategicAlignment: 'Safety Excellence'
            }
          }
        })
      }
    }

    // SLA → Process relationships
    if (slas[0] && process) {
      // Get the process's graph node
      const processNode = await prisma.node.findFirst({
        where: { id: process.graphNodeId || '' }
      })
      
      if (processNode) {
        await prisma.edge.create({
          data: {
            fromId: slas[0].graphNodeId!,
            toId: processNode.id,
            relationType: 'applies_to',
            metadata: {
              targetFrequency: 'daily',
              acceptableLapse: '1 day',
              verificationMethod: 'Automated + Manual'
            }
          }
        })
      }
    }

    // KPQ → Process relationships
    if (kpqs[0] && process) {
      // Get the process's graph node
      const processNode = await prisma.node.findFirst({
        where: { id: process.graphNodeId || '' }
      })
      
      if (processNode) {
        await prisma.edge.create({
          data: {
            fromId: kpqs[0].graphNodeId!,
            toId: processNode.id,
            relationType: 'questions',
            metadata: {
              scope: 'Tailings Risk Response',
              lastTested: '2025-06-20',
              testingMethod: 'Scenario-based'
            }
          }
        })
      }
    }

    // ============================================================================
    // CREATE PERFORMANCE METRICS
    // ============================================================================

    console.log('📈 Creating performance metrics...')

    // OKR Metrics
    await Promise.all([
      prisma.oKRMetric.create({
        data: {
          okrId: okrs[0].id,
          metric: 'Safety Incident Rate',
          value: 0.5,
          target: 0.0,
          unit: 'incidents per 100,000 hours',
          period: 'Q3-2025',
          status: MetricStatus.ON_TRACK,
          metadata: {
            trend: 'improving',
            benchmark: 'Industry average: 1.2',
            calculationMethod: 'Lost time injuries per hours worked'
          }
        }
      }),

      prisma.oKRMetric.create({
        data: {
          okrId: okrs[1].id,
          metric: 'Overall Equipment Effectiveness',
          value: 92.5,
          target: 95.0,
          unit: 'percentage',
          period: 'Q3-2025',
          status: MetricStatus.AT_RISK,
          metadata: {
            trend: 'stable',
            breakdown: 'Availability: 95%, Performance: 97%, Quality: 98%',
            improvementPlan: 'Focus on availability optimization'
          }
        }
      })
    ])

    // SLA Metrics
    await Promise.all([
      prisma.sLAMetric.create({
        data: {
          slaId: slas[0].id,
          metric: 'Control Verification Compliance',
          value: 98.5,
          target: 100.0,
          unit: 'percentage',
          period: 'Current Week',
          status: MetricStatus.ON_TRACK,
          metadata: {
            trend: 'improving',
            missedVerifications: 2,
            reasons: ['System maintenance', 'Operator training']
          }
        }
      }),

      prisma.sLAMetric.create({
        data: {
          slaId: slas[1].id,
          metric: 'Process Response Time',
          value: 8.5,
          target: 10.0,
          unit: 'minutes',
          period: 'Current Month',
          status: MetricStatus.ON_TRACK,
          metadata: {
            trend: 'stable',
            averageResponse: '8.5 minutes',
            fastestResponse: '3.2 minutes',
            slowestResponse: '12.1 minutes'
          }
        }
      })
    ])

    // KPQ Metrics
    await Promise.all([
      prisma.kPQMetric.create({
        data: {
          kpqId: kpqs[0].id,
          metric: 'Operator Competency Score',
          value: 87.0,
          target: 90.0,
          unit: 'percentage',
          period: 'Latest Assessment',
          status: MetricStatus.AT_RISK,
          metadata: {
            assessmentDate: '2025-06-20',
            competencyAreas: ['Emergency Response', 'Protocol Knowledge', 'Decision Making'],
            improvementAreas: ['Advanced Scenarios', 'Stress Management']
          }
        }
      }),

      prisma.kPQMetric.create({
        data: {
          kpqId: kpqs[1].id,
          metric: 'Emergency Response Time',
          value: 7.8,
          target: 10.0,
          unit: 'minutes',
          period: 'Latest Drill',
          status: MetricStatus.ON_TRACK,
          metadata: {
            drillDate: '2025-07-15',
            scenario: 'Tailings Emergency',
            teamPerformance: 'Excellent',
            areasForImprovement: 'Communication protocols'
          }
        }
      })
    ])

    console.log('✅ OKR/SLA/KPQ seeding completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`  - OKRs created: ${okrs.length}`)
    console.log(`  - SLAs created: ${slas.length}`)
    console.log(`  - KPQs created: ${kpqs.length}`)
    console.log(`  - Graph nodes created: ${okrs.length + slas.length + kpqs.length}`)
    console.log(`  - Graph relationships created: 3`)
    console.log(`  - Performance metrics created: 6`)

  } catch (error) {
    console.error('❌ Error during OKR/SLA/KPQ seeding:', error)
    throw error
  }
} 