# Canvas Status Management - Business Analysis

## Executive Summary
This document outlines the business rules and criteria for managing canvas status transitions in the CapOpt Platform. The status management system ensures data integrity, workflow compliance, and proper governance of business canvas lifecycle.

## Current Canvas Statuses
- **DRAFT**: Initial state for new or incomplete canvases
- **REVIEW**: Canvas under review or approval process
- **PUBLISHED**: Approved and active canvas
- **ARCHIVED**: Retired or inactive canvas

## Business Rules for Status Transitions

### 1. DRAFT Status
**Criteria for DRAFT:**
- Newly created canvas
- Cloned canvas (automatic)
- Canvas with incomplete mandatory fields
- Canvas returned from review with issues

**Mandatory Fields for DRAFT:**
- Canvas name
- Description
- Industry (if applicable)

**Actions Allowed:**
- Edit all fields
- Add/remove content items
- Clone canvas
- Delete canvas
- Move to REVIEW (if criteria met)

### 2. REVIEW Status
**Criteria for REVIEW:**
- All mandatory fields completed
- Minimum content requirements met
- Canvas ready for stakeholder review

**Mandatory Fields for REVIEW:**
- Canvas name
- Description
- Industry
- Sector
- Business type
- At least 3 value propositions
- At least 2 customer segments
- At least 2 revenue streams
- At least 2 key partnerships
- At least 3 key resources
- At least 3 key activities
- At least 2 cost structures
- At least 2 channels

**Content Quality Requirements:**
- Each content item must have a title
- Each content item must have a description
- No duplicate content items within the same section

**Actions Allowed:**
- Edit all fields
- Add/remove content items
- Move to DRAFT (if issues found)
- Move to PUBLISHED (if approved)
- Archive canvas

### 3. PUBLISHED Status
**Criteria for PUBLISHED:**
- All REVIEW criteria met
- Approved by authorized stakeholder
- No pending changes or conflicts
- Compliance requirements satisfied

**Additional Requirements for PUBLISHED:**
- All content items must have complete information
- Strategic objective must be defined
- Value proposition must be clear and compelling
- Risk profile must be assessed
- Digital maturity level must be defined
- Compliance requirements must be documented

**Actions Allowed:**
- View canvas (read-only for most users)
- Export canvas
- Share canvas
- Move to REVIEW (for updates)
- Archive canvas (by authorized users only)

### 4. ARCHIVED Status
**Criteria for ARCHIVED:**
- Canvas no longer active or relevant
- Superseded by newer version
- Regulatory or compliance changes
- Business restructuring

**Actions Allowed:**
- View canvas (read-only)
- Export canvas
- Restore to DRAFT (by authorized users only)
- Delete canvas (by authorized users only)

## Status Transition Workflow

### DRAFT → REVIEW
**Validation Checks:**
1. All mandatory fields completed
2. Minimum content requirements met
3. No validation errors
4. Content quality standards met

**Business Rules:**
- Only canvas owners and managers can initiate review
- System validates all criteria automatically
- User receives feedback on missing requirements

### REVIEW → PUBLISHED
**Validation Checks:**
1. All REVIEW criteria met
2. Approval workflow completed
3. No pending changes
4. Compliance verification passed

**Business Rules:**
- Requires authorized approver
- Creates audit trail
- Triggers notifications to stakeholders
- Locks canvas for editing (except by authorized users)

### PUBLISHED → REVIEW
**Business Rules:**
- Creates new version of canvas
- Preserves original published version
- Requires change justification
- Triggers review workflow

### Any Status → ARCHIVED
**Business Rules:**
- Requires justification
- Creates audit trail
- Notifies stakeholders
- Preserves data for compliance

## Clone Canvas Rules

### Automatic Status Assignment
- **Cloned canvas always starts as DRAFT**
- **Reasoning**: Ensures proper review process for new canvas
- **Business Justification**: Prevents accidental publication of unverified content

### Clone Process
1. Copy all content from source canvas
2. Reset status to DRAFT
3. Clear approval history
4. Update metadata (name, description, timestamps)
5. Maintain parent-child relationship if applicable

## Technical Implementation Requirements

### Validation Engine
- Real-time validation of status transition criteria
- Comprehensive error reporting
- User-friendly feedback messages
- Audit trail for all status changes

### Permission System
- Role-based access control for status changes
- Approval workflow integration
- Audit logging for compliance

### User Interface
- Clear status indicators
- Intuitive status change workflow
- Progress tracking for review process
- Bulk status management for multiple canvases

## Compliance and Governance

### Audit Requirements
- All status changes logged with timestamp and user
- Change justification required for significant transitions
- Regular audit reports for compliance

### Data Retention
- Archived canvases retained for regulatory compliance
- Version history maintained for published canvases
- Export capabilities for all statuses

## Success Metrics

### Operational Metrics
- Time to review completion
- Review approval rates
- Status transition frequency
- User adoption of status workflow

### Quality Metrics
- Content completeness rates
- Validation error frequency
- User satisfaction with workflow
- Compliance audit results

## Risk Mitigation

### Data Integrity
- Validation prevents invalid status transitions
- Backup and recovery procedures
- Version control for published canvases

### User Experience
- Clear guidance on status requirements
- Progressive disclosure of complex criteria
- Helpful error messages and suggestions

### Compliance
- Audit trails for all changes
- Role-based access controls
- Regular compliance reviews 