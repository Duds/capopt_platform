/**
 * Business Canvas Icons - Visual Icon Definitions
 * 
 * Defines icons for each section of the business model canvas:
 * - Key Partners: Handshake icon
 * - Key Activities: Activity icon
 * - Key Resources: Package icon
 * - Value Propositions: Heart icon
 * - Customer Relationships: Users icon
 * - Channels: Radio icon
 * - Customer Segments: Users icon
 * - Cost Structure: Trending Down icon
 * - Revenue Streams: Dollar Sign icon
 * 
 * These icons provide visual context for each canvas section
 * and improve user experience and navigation.
 */

import { 
  Users, 
  Handshake, 
  Activity, 
  Package, 
  Heart, 
  Radio, 
  DollarSign, 
  TrendingDown
} from 'lucide-react'

export const canvasSectionIcons = {
  keyPartners: <Handshake className="h-5 w-5" />,
  keyActivities: <Activity className="h-5 w-5" />,
  keyResources: <Package className="h-5 w-5" />,
  valuePropositions: <Heart className="h-5 w-5" />,
  customerRelationships: <Users className="h-5 w-5" />,
  channels: <Radio className="h-5 w-5" />,
  customerSegments: <Users className="h-5 w-5" />,
  costStructure: <TrendingDown className="h-5 w-5" />,
  revenueStreams: <DollarSign className="h-5 w-5" />
} 