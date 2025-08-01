/**
 * Centralised Test Selectors for CapOpt Platform
 * 
 * This file contains all test ID constants used across the application.
 * All components and tests MUST import from this file to ensure consistency.
 * 
 * Naming Convention: test-{entity}-{action/component}
 * Examples: test-user-card, test-canvas-save-button, test-process-form
 * 
 * @schema Aligned with Prisma schema entities
 * @seed Aligned with seed data structure
 * @note DO NOT use inline data-testid values - import from this file
 */

// ============================================================================
// USER MANAGEMENT & AUTHENTICATION
// ============================================================================

export const userTestIds = {
  // User Cards and Lists
  userCard: 'test-user-card',
  userList: 'test-user-list',
  userTable: 'test-user-table',
  userRow: 'test-user-row',
  
  // User Forms
  userForm: 'test-user-form',
  userCreateForm: 'test-user-create-form',
  userEditForm: 'test-user-edit-form',
  userProfileForm: 'test-user-profile-form',
  
  // User Inputs
  inputEmail: 'test-input-email',
  inputName: 'test-input-name',
  inputPassword: 'test-input-password',
  inputRole: 'test-input-role',
  inputDepartment: 'test-input-department',
  
  // User Actions
  userSaveButton: 'test-user-save-button',
  userDeleteButton: 'test-user-delete-button',
  userEditButton: 'test-user-edit-button',
  userActivateButton: 'test-user-activate-button',
  userDeactivateButton: 'test-user-deactivate-button',
  
  // User Status
  userStatusActive: 'test-user-status-active',
  userStatusInactive: 'test-user-status-inactive',
  userLastLogin: 'test-user-last-login',
  
  // Authentication
  loginForm: 'test-login-form',
  loginEmail: 'test-login-email',
  loginPassword: 'test-login-password',
  loginSubmit: 'test-login-submit',
  loginError: 'test-login-error',
  
  registerForm: 'test-register-form',
  registerSubmit: 'test-register-submit',
  registerError: 'test-register-error',
  
  logoutButton: 'test-logout-button',
  profileButton: 'test-profile-button',
} as const;

// ============================================================================
// BUSINESS CANVAS - ENHANCED METADATA
// ============================================================================

export const canvasTestIds = {
  // Canvas Containers
  canvasContainer: 'test-canvas-container',
  canvasEditor: 'test-canvas-editor',
  canvasViewer: 'test-canvas-viewer',
  canvasList: 'test-canvas-list',
  canvasCard: 'test-canvas-card',
  canvasHierarchy: 'test-canvas-hierarchy',
  canvasTreeView: 'test-canvas-tree-view',
  canvasListView: 'test-canvas-list-view',
  
  // Canvas Forms
  canvasForm: 'test-canvas-form',
  canvasCreateForm: 'test-canvas-create-form',
  canvasEditForm: 'test-canvas-edit-form',
  canvasMetadataForm: 'test-canvas-metadata-form',
  
  // Canvas Basic Inputs
  inputCanvasName: 'test-input-canvas-name',
  inputCanvasDescription: 'test-input-canvas-description',
  inputCanvasVersion: 'test-input-canvas-version',
  inputCanvasStatus: 'test-input-canvas-status',
  inputCanvasEditMode: 'test-input-canvas-edit-mode',
  
  // Canvas Enhanced Metadata Inputs
  inputLegalName: 'test-input-legal-name',
  inputABN: 'test-input-abn',
  inputACN: 'test-input-acn',
  inputIndustry: 'test-input-industry',
  inputSector: 'test-input-sector',
  inputSectors: 'test-input-sectors',
  inputSectorTypes: 'test-input-sector-types',
  inputPrimarySector: 'test-input-primary-sector',
  inputBusinessType: 'test-input-business-type',
  inputRegional: 'test-input-regional',
  inputPrimaryLocation: 'test-input-primary-location',
  inputCoordinates: 'test-input-coordinates',
  inputFacilityType: 'test-input-facility-type',
  inputOperationalStreams: 'test-input-operational-streams',
  inputStrategicObjective: 'test-input-strategic-objective',
  inputValueProposition: 'test-input-value-proposition',
  inputCompetitiveAdvantage: 'test-input-competitive-advantage',
  inputAnnualRevenue: 'test-input-annual-revenue',
  inputEmployeeCount: 'test-input-employee-count',
  inputRiskProfile: 'test-input-risk-profile',
  inputComplianceRequirements: 'test-input-compliance-requirements',
  inputRegulatoryFramework: 'test-input-regulatory-framework',
  
  // Canvas Actions
  canvasSaveButton: 'test-canvas-save-button',
  canvasDeleteButton: 'test-canvas-delete-button',
  canvasDeleteChildButton: 'test-canvas-delete-child-button',
  canvasAddChildButton: 'test-canvas-add-child-button',
  canvasEditButton: 'test-canvas-edit-button',
  canvasDuplicateButton: 'test-canvas-duplicate-button',
  canvasExportButton: 'test-canvas-export-button',
  canvasShareButton: 'test-canvas-share-button',
  canvasTemplateButton: 'test-canvas-template-button',
  canvasCloneButton: 'test-canvas-clone-button',
  canvasArchiveButton: 'test-canvas-archive-button',
  canvasMoveButton: 'test-canvas-move-button',
  canvasBulkSelectButton: 'test-canvas-bulk-select-button',
  canvasBulkDeleteButton: 'test-canvas-bulk-delete-button',
  canvasBulkArchiveButton: 'test-canvas-bulk-archive-button',
  
  // Canvas Sections
  valuePropositionSection: 'test-value-proposition-section',
  customerSegmentSection: 'test-customer-segment-section',
  revenueStreamSection: 'test-revenue-stream-section',
  partnershipSection: 'test-partnership-section',
  resourceSection: 'test-resource-section',
  activitySection: 'test-activity-section',
  costStructureSection: 'test-cost-structure-section',
  channelSection: 'test-channel-section',
  
  // Canvas Items
  canvasItem: 'test-canvas-item',
  canvasItemAdd: 'test-canvas-item-add',
  canvasItemEdit: 'test-canvas-item-edit',
  canvasItemDelete: 'test-canvas-item-delete',
  
  // Canvas Status
  canvasStatusDraft: 'test-canvas-status-draft',
  canvasStatusPublished: 'test-canvas-status-published',
  canvasStatusArchived: 'test-canvas-status-archived',
  canvasStatusReview: 'test-canvas-status-review',
  canvasStatusApproved: 'test-canvas-status-approved',
  
  // Canvas Hierarchy
  canvasParent: 'test-canvas-parent',
  canvasChild: 'test-canvas-child',
  canvasBreadcrumb: 'test-canvas-breadcrumb',
  canvasTreeItem: 'test-canvas-tree-item',
  canvasTreeExpand: 'test-canvas-tree-expand',
  canvasTreeCollapse: 'test-canvas-tree-collapse',
  
  // Canvas Selection
  canvasCheckbox: 'test-canvas-checkbox',
  canvasSelectAll: 'test-canvas-select-all',
  canvasDeselectAll: 'test-canvas-deselect-all',
  
  // Canvas Dialogs
  canvasDeleteDialog: 'test-canvas-delete-dialog',
  canvasArchiveDialog: 'test-canvas-archive-dialog',
  canvasMoveDialog: 'test-canvas-move-dialog',
  canvasBulkDeleteDialog: 'test-canvas-bulk-delete-dialog',
  canvasStatusDialog: 'test-canvas-status-dialog',
} as const;

// ============================================================================
// ENTERPRISE & FACILITY
// ============================================================================

export const enterpriseTestIds = {
  // Enterprise Containers
  enterpriseCard: 'test-enterprise-card',
  enterpriseList: 'test-enterprise-list',
  enterpriseForm: 'test-enterprise-form',
  
  // Enterprise Inputs
  inputEnterpriseName: 'test-input-enterprise-name',
  inputLegalName: 'test-input-enterprise-legal-name',
  inputABN: 'test-input-enterprise-abn',
  inputACN: 'test-input-enterprise-acn',
  inputIndustry: 'test-input-enterprise-industry',
  inputSector: 'test-input-enterprise-sector',
  
  // Enterprise Actions
  enterpriseSaveButton: 'test-enterprise-save-button',
  enterpriseEditButton: 'test-enterprise-edit-button',
  enterpriseDeleteButton: 'test-enterprise-delete-button',
  
  // Facility
  facilityCard: 'test-facility-card',
  facilityList: 'test-facility-list',
  facilityForm: 'test-facility-form',
  facilityMap: 'test-facility-map',
  
  inputFacilityName: 'test-input-facility-name',
  inputFacilityType: 'test-input-facility-type',
  inputFacilityStatus: 'test-input-facility-status',
  inputFacilityLocation: 'test-input-facility-location',
  
  // Business Unit
  businessUnitCard: 'test-business-unit-card',
  businessUnitList: 'test-business-unit-list',
  businessUnitForm: 'test-business-unit-form',
  
  inputBusinessUnitName: 'test-input-business-unit-name',
  inputBusinessUnitType: 'test-input-business-unit-type',
  inputBusinessUnitStatus: 'test-input-business-unit-status',
  
  // Department
  departmentCard: 'test-department-card',
  departmentList: 'test-department-list',
  departmentForm: 'test-department-form',
  
  inputDepartmentName: 'test-input-department-name',
  inputDepartmentType: 'test-input-department-type',
  inputDepartmentStatus: 'test-input-department-status',
} as const;

// ============================================================================
// PROCESSES & CONTROLS - ENHANCED
// ============================================================================

export const processTestIds = {
  // Process Containers
  processCard: 'test-process-card',
  processList: 'test-process-list',
  processForm: 'test-process-form',
  processMap: 'test-process-map',
  processFlow: 'test-process-flow',
  
  // Process Inputs
  inputProcessName: 'test-input-process-name',
  inputProcessDescription: 'test-input-process-description',
  inputProcessStatus: 'test-input-process-status',
  inputProcessPriority: 'test-input-process-priority',
  inputProcessVersion: 'test-input-process-version',
  
  // Process Actions
  processSaveButton: 'test-process-save-button',
  processEditButton: 'test-process-edit-button',
  processDeleteButton: 'test-process-delete-button',
  processStartButton: 'test-process-start-button',
  processStopButton: 'test-process-stop-button',
  processPublishButton: 'test-process-publish-button',
  
  // Process Steps
  processStep: 'test-process-step',
  processStepAdd: 'test-process-step-add',
  processStepEdit: 'test-process-step-edit',
  processStepDelete: 'test-process-step-delete',
  processStepReorder: 'test-process-step-reorder',
  
  inputStepName: 'test-input-step-name',
  inputStepDescription: 'test-input-step-description',
  inputStepOrder: 'test-input-step-order',
  inputStepDuration: 'test-input-step-duration',
  inputStepResponsible: 'test-input-step-responsible',
  
  // Process Inputs/Outputs
  processInput: 'test-process-input',
  processInputAdd: 'test-process-input-add',
  processInputEdit: 'test-process-input-edit',
  processInputDelete: 'test-process-input-delete',
  
  inputInputName: 'test-input-input-name',
  inputInputType: 'test-input-input-type',
  inputInputRequired: 'test-input-input-required',
  
  processOutput: 'test-process-output',
  processOutputAdd: 'test-process-output-add',
  processOutputEdit: 'test-process-output-edit',
  processOutputDelete: 'test-process-output-delete',
  
  inputOutputName: 'test-input-output-name',
  inputOutputType: 'test-input-output-type',
  inputOutputQuality: 'test-input-output-quality',
  
  // Process Metrics
  processMetric: 'test-process-metric',
  processMetricAdd: 'test-process-metric-add',
  processMetricEdit: 'test-process-metric-edit',
  processMetricDelete: 'test-process-metric-delete',
  
  inputMetricName: 'test-input-metric-name',
  inputMetricValue: 'test-input-metric-value',
  inputMetricUnit: 'test-input-metric-unit',
  inputMetricTarget: 'test-input-metric-target',
  inputMetricFrequency: 'test-input-metric-frequency',
  
  // Process Risks
  processRisk: 'test-process-risk',
  processRiskAdd: 'test-process-risk-add',
  processRiskEdit: 'test-process-risk-edit',
  processRiskDelete: 'test-process-risk-delete',
  
  inputRiskName: 'test-input-risk-name',
  inputRiskSeverity: 'test-input-risk-severity',
  inputRiskLikelihood: 'test-input-risk-likelihood',
  inputRiskImpact: 'test-input-risk-impact',
  
  // Controls
  controlCard: 'test-control-card',
  controlList: 'test-control-list',
  controlForm: 'test-control-form',
  controlMatrix: 'test-control-matrix',
  
  inputControlName: 'test-input-control-name',
  inputControlType: 'test-input-control-type',
  inputControlCategory: 'test-input-control-category',
  inputControlEffectiveness: 'test-input-control-effectiveness',
  inputControlFrequency: 'test-input-control-frequency',
  inputControlIsCritical: 'test-input-control-is-critical',
  inputControlPriority: 'test-input-control-priority',
  inputControlComplianceStatus: 'test-input-control-compliance-status',
  
  controlSaveButton: 'test-control-save-button',
  controlEditButton: 'test-control-edit-button',
  controlDeleteButton: 'test-control-delete-button',
  controlVerifyButton: 'test-control-verify-button',
  
  // Control Verification
  verificationLog: 'test-verification-log',
  verificationLogAdd: 'test-verification-log-add',
  verificationLogEdit: 'test-verification-log-edit',
  
  inputVerificationStatus: 'test-input-verification-status',
  inputVerificationNotes: 'test-input-verification-notes',
  inputVerificationEvidence: 'test-input-verification-evidence',
  
  // Risk Categories
  riskCategory: 'test-risk-category',
  riskCategoryAdd: 'test-risk-category-add',
  riskCategoryEdit: 'test-risk-category-edit',
  riskCategoryDelete: 'test-risk-category-delete',
  
  inputRiskCategoryName: 'test-input-risk-category-name',
  inputRiskCategoryColor: 'test-input-risk-category-color',
  
  // Control Types
  controlType: 'test-control-type',
  controlTypeAdd: 'test-control-type-add',
  controlTypeEdit: 'test-control-type-edit',
  controlTypeDelete: 'test-control-type-delete',
  
  inputControlTypeName: 'test-input-control-type-name',
  inputControlTypeCategory: 'test-input-control-type-category',
  
  // Control Effectiveness
  controlEffectiveness: 'test-control-effectiveness',
  controlEffectivenessAdd: 'test-control-effectiveness-add',
  controlEffectivenessEdit: 'test-control-effectiveness-edit',
  
  inputEffectivenessRating: 'test-input-effectiveness-rating',
  inputEffectivenessScore: 'test-input-effectiveness-score',
} as const;

// ============================================================================
// ASSETS - ENHANCED
// ============================================================================

export const assetTestIds = {
  // Asset Containers
  assetCard: 'test-asset-card',
  assetList: 'test-asset-list',
  assetForm: 'test-asset-form',
  assetMap: 'test-asset-map',
  assetDashboard: 'test-asset-dashboard',
  
  // Asset Inputs
  inputAssetName: 'test-input-asset-name',
  inputAssetType: 'test-input-asset-type',
  inputAssetStatus: 'test-input-asset-status',
  inputAssetCriticality: 'test-input-asset-criticality',
  inputAssetLocation: 'test-input-asset-location',
  inputAssetDescription: 'test-input-asset-description',
  inputAssetVersion: 'test-input-asset-version',
  
  // Asset Actions
  assetSaveButton: 'test-asset-save-button',
  assetEditButton: 'test-asset-edit-button',
  assetDeleteButton: 'test-asset-delete-button',
  assetMonitorButton: 'test-asset-monitor-button',
  assetOptimiseButton: 'test-asset-optimise-button',
  assetProtectButton: 'test-asset-protect-button',
  
  // Asset Risks
  assetRiskCard: 'test-asset-risk-card',
  assetRiskForm: 'test-asset-risk-form',
  assetRiskAdd: 'test-asset-risk-add',
  assetRiskEdit: 'test-asset-risk-edit',
  assetRiskDelete: 'test-asset-risk-delete',
  
  inputAssetRiskName: 'test-input-asset-risk-name',
  inputAssetRiskSeverity: 'test-input-asset-risk-severity',
  inputAssetRiskLikelihood: 'test-input-asset-risk-likelihood',
  
  // Asset Protection
  assetProtection: 'test-asset-protection',
  assetProtectionAdd: 'test-asset-protection-add',
  assetProtectionEdit: 'test-asset-protection-edit',
  
  inputProtectionType: 'test-input-protection-type',
  inputProtectionDescription: 'test-input-protection-description',
  
  // Asset Monitoring
  assetMonitor: 'test-asset-monitor',
  assetMonitorAdd: 'test-asset-monitor-add',
  assetMonitorEdit: 'test-asset-monitor-edit',
  
  inputMonitorType: 'test-input-monitor-type',
  inputMonitorStatus: 'test-input-monitor-status',
  inputMonitorFrequency: 'test-input-monitor-frequency',
  
  // Asset Optimization
  assetOptimisation: 'test-asset-optimisation',
  assetOptimisationAdd: 'test-asset-optimisation-add',
  assetOptimisationEdit: 'test-asset-optimisation-edit',
  
  inputOptimisationType: 'test-input-optimisation-type',
  inputOptimisationStatus: 'test-input-optimisation-status',
  inputOptimisationTarget: 'test-input-optimisation-target',
} as const;

// ============================================================================
// INDUSTRY & SECTOR FRAMEWORK
// ============================================================================

export const industryTestIds = {
  // Industry
  industryCard: 'test-industry-card',
  industryList: 'test-industry-list',
  industryForm: 'test-industry-form',
  
  inputIndustryCode: 'test-input-industry-code',
  inputIndustryName: 'test-input-industry-name',
  inputIndustryCategory: 'test-input-industry-category',
  
  // Sector
  sectorCard: 'test-sector-card',
  sectorList: 'test-sector-list',
  sectorForm: 'test-sector-form',
  
  inputSectorCode: 'test-input-sector-code',
  inputSectorName: 'test-input-sector-name',
  inputSectorDescription: 'test-input-sector-description',
  
  // Industry Facility Types
  facilityTypeCard: 'test-facility-type-card',
  facilityTypeList: 'test-facility-type-list',
  facilityTypeForm: 'test-facility-type-form',
  
  inputFacilityTypeCode: 'test-input-facility-type-code',
  inputFacilityTypeName: 'test-input-facility-type-name',
  inputFacilityTypeCategory: 'test-input-facility-type-category',
  inputFacilityTypeRiskProfile: 'test-input-facility-type-risk-profile',
  
  // Industry Operational Streams
  operationalStreamCard: 'test-operational-stream-card',
  operationalStreamList: 'test-operational-stream-list',
  operationalStreamForm: 'test-operational-stream-form',
  
  inputOperationalStreamCode: 'test-input-operational-stream-code',
  inputOperationalStreamName: 'test-input-operational-stream-name',
  
  // Industry Compliance Frameworks
  complianceFrameworkCard: 'test-compliance-framework-card',
  complianceFrameworkList: 'test-compliance-framework-list',
  complianceFrameworkForm: 'test-compliance-framework-form',
  
  inputComplianceFrameworkCode: 'test-input-compliance-framework-code',
  inputComplianceFrameworkName: 'test-input-compliance-framework-name',
} as const;

// ============================================================================
// BOWTIE ANALYSIS
// ============================================================================

export const bowtieTestIds = {
  // Bowtie Model
  bowtieModel: 'test-bowtie-model',
  bowtieModelCard: 'test-bowtie-model-card',
  bowtieModelList: 'test-bowtie-model-list',
  bowtieModelForm: 'test-bowtie-model-form',
  
  inputBowtieName: 'test-input-bowtie-name',
  inputBowtieStatus: 'test-input-bowtie-status',
  
  // Top Event
  topEvent: 'test-top-event',
  topEventAdd: 'test-top-event-add',
  topEventEdit: 'test-top-event-edit',
  
  inputTopEventName: 'test-input-top-event-name',
  inputTopEventDescription: 'test-input-top-event-description',
  
  // Threats
  threat: 'test-threat',
  threatAdd: 'test-threat-add',
  threatEdit: 'test-threat-edit',
  threatDelete: 'test-threat-delete',
  
  inputThreatName: 'test-input-threat-name',
  inputThreatDescription: 'test-input-threat-description',
  
  // Consequences
  consequence: 'test-consequence',
  consequenceAdd: 'test-consequence-add',
  consequenceEdit: 'test-consequence-edit',
  consequenceDelete: 'test-consequence-delete',
  
  inputConsequenceName: 'test-input-consequence-name',
  inputConsequenceDescription: 'test-input-consequence-description',
  
  // Controls
  preventiveControl: 'test-preventive-control',
  preventiveControlAdd: 'test-preventive-control-add',
  preventiveControlEdit: 'test-preventive-control-edit',
  
  mitigatingControl: 'test-mitigating-control',
  mitigatingControlAdd: 'test-mitigating-control-add',
  mitigatingControlEdit: 'test-mitigating-control-edit',
  
  inputControlName: 'test-input-bowtie-control-name',
  inputControlType: 'test-input-bowtie-control-type',
  inputControlEffectiveness: 'test-input-bowtie-control-effectiveness',
} as const;

// ============================================================================
// MATURITY ASSESSMENTS
// ============================================================================

export const maturityTestIds = {
  // Maturity Assessment
  maturityAssessment: 'test-maturity-assessment',
  maturityAssessmentCard: 'test-maturity-assessment-card',
  maturityAssessmentList: 'test-maturity-assessment-list',
  maturityAssessmentForm: 'test-maturity-assessment-form',
  
  inputAssessmentName: 'test-input-assessment-name',
  inputAssessmentDescription: 'test-input-assessment-description',
  
  // Capability Score
  capabilityScore: 'test-capability-score',
  capabilityScoreAdd: 'test-capability-score-add',
  capabilityScoreEdit: 'test-capability-score-edit',
  
  inputCapabilityName: 'test-input-capability-name',
  inputCapabilityScore: 'test-input-capability-score',
  inputCapabilityLevel: 'test-input-capability-level',
  
  // Improvement Roadmap
  improvementRoadmap: 'test-improvement-roadmap',
  improvementRoadmapAdd: 'test-improvement-roadmap-add',
  improvementRoadmapEdit: 'test-improvement-roadmap-edit',
  
  inputRoadmapName: 'test-input-roadmap-name',
  inputRoadmapStatus: 'test-input-roadmap-status',
  inputRoadmapPriority: 'test-input-roadmap-priority',
} as const;

// ============================================================================
// NAVIGATION & UI COMPONENTS
// ============================================================================

export const navigationTestIds = {
  // Main Navigation
  mainNav: 'test-main-nav',
  sidebarNav: 'test-sidebar-nav',
  breadcrumb: 'test-breadcrumb',
  
  // Navigation Items
  navStrategic: 'test-nav-strategic',
  navOperational: 'test-nav-operational',
  navControls: 'test-nav-controls',
  navAssets: 'test-nav-assets',
  navUsers: 'test-nav-users',
  navProcesses: 'test-nav-processes',
  
  // Context Navigation
  enterpriseContext: 'test-enterprise-context',
  strategicContext: 'test-strategic-context',
  
  // Mobile Navigation
  mobileMenu: 'test-mobile-menu',
  mobileMenuToggle: 'test-mobile-menu-toggle',
} as const;

export const uiTestIds = {
  // Common UI Elements
  button: 'test-button',
  input: 'test-input',
  select: 'test-select',
  checkbox: 'test-checkbox',
  radio: 'test-radio',
  textarea: 'test-textarea',
  
  // Dialogs and Modals
  dialog: 'test-dialog',
  modal: 'test-modal',
  dialogClose: 'test-dialog-close',
  modalClose: 'test-modal-close',
  
  // Loading States
  loadingSpinner: 'test-loading-spinner',
  loadingSkeleton: 'test-loading-skeleton',
  
  // Error States
  errorMessage: 'test-error-message',
  errorBoundary: 'test-error-boundary',
  
  // Success States
  successMessage: 'test-success-message',
  successToast: 'test-success-toast',
  
  // Form Elements
  form: 'test-form',
  formSubmit: 'test-form-submit',
  formReset: 'test-form-reset',
  formValidation: 'test-form-validation',
  
  // Complex UI Elements
  dragDrop: 'test-drag-drop',
  dragDropZone: 'test-drag-drop-zone',
  dragDropItem: 'test-drag-drop-item',
  
  treeView: 'test-tree-view',
  treeItem: 'test-tree-item',
  treeExpand: 'test-tree-expand',
  treeCollapse: 'test-tree-collapse',
  
  multiSelect: 'test-multi-select',
  multiSelectItem: 'test-multi-select-item',
  multiSelectAll: 'test-multi-select-all',
  multiSelectNone: 'test-multi-select-none',
  
  autoSave: 'test-auto-save',
  autoSaveIndicator: 'test-auto-save-indicator',
} as const;

// ============================================================================
// DEBUG & DEVELOPMENT
// ============================================================================

export const debugTestIds = {
  debugPanel: 'test-debug-panel',
  debugToggle: 'test-debug-toggle',
  debugInfo: 'test-debug-info',
  debugError: 'test-debug-error',
  debugWarning: 'test-debug-warning',
} as const;

// ============================================================================
// EXPORT ALL TEST IDS
// ============================================================================

export const testIds = {
  ...userTestIds,
  ...canvasTestIds,
  ...enterpriseTestIds,
  ...processTestIds,
  ...assetTestIds,
  ...industryTestIds,
  ...bowtieTestIds,
  ...maturityTestIds,
  ...navigationTestIds,
  ...uiTestIds,
  ...debugTestIds,
} as const;

// Type for all test IDs
export type TestId = typeof testIds[keyof typeof testIds];

// Helper function to validate test IDs
export const isValidTestId = (id: string): id is TestId => {
  return Object.values(testIds).includes(id as TestId);
};

// Helper function to get test ID by pattern
export const getTestIdByPattern = (pattern: string): TestId[] => {
  return Object.values(testIds).filter(id => id.includes(pattern)) as TestId[];
}; 