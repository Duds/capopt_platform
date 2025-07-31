# CapOpt Platform – Design Documentation

Welcome to the design documentation for the CapOpt Platform. This directory provides comprehensive resources for understanding the platform's purpose, problems it solves, user experience, technical architecture, and design principles.

## Structure

This folder contains the following key documents:

- **[Why Statement](./why-statement.md):**  
  Defines the purpose, vision, and motivation behind the CapOpt Platform.

- **[Problem Statement](./problem-statement.md):**  
  Clearly defines the specific problems the platform is designed to solve.

- **[Value Proposition](./value-proposition.md):**
  Outlines the value delivered to high-risk industries and stakeholders.

- **[Business Canvas Naming Conventions](./business-canvas-naming-conventions.md):**
  Standardized naming conventions for Business Canvas components and interfaces.

- **[Business Canvas Naming Quick Reference](./business-canvas-naming-quick-reference.md):**
  Quick reference guide for Business Canvas naming conventions.

- **[UX Architecture Design](./ux-architecture-design.md):**  
  Details user experience flows, user journeys, and interface design principles.

- **[Solution Architecture Design](./solution-architecture-design.md):**  
  Outlines the technical architecture, system components, integration patterns, and deployment considerations.

- **[Product Backlog](./product-backlog.md):**  
  Comprehensive product backlog with prioritised phases (PoC, MVP, Extended Rollout).

- **README.md:**  
  This file. Provides an overview of the design documentation and guidance for contributors.

## Overview

The CapOpt Platform is a comprehensive operational capability optimisation system designed for high-risk industries (mining, minerals, petrochemicals, defence). The platform embeds Critical Controls Theory across all organisational layers, ensuring risk and control are central to every decision and process.

### Key Principles

- **Critical Controls Theory-Led:** Risk management and control assurance at every layer
- **Regulatory Alignment:** Compliance with WHS, ISO, ICMM, and defence standards
- **Operational Assurance:** Real-time visibility and monitoring of critical controls
- **Strategic Integration:** Alignment of business objectives with operational reality

### Technology Stack

- **Frontend:** React 18+, Next.js 15+, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js/Fastify, PostgreSQL, Redis, Prisma, JWT
- **Deployment:** Docker, Kubernetes, Azure Cloud Services
- **Analytics:** Data Warehouse, ETL Pipelines, BI Tools, AI/ML Engine

## Extended Design Documents

- [Reference Architecture: Controls-Led Platform for High-Risk Industries](./reference-architecture.md)
- [Go-To-Market (GTM) Strategy for High-Risk Industries](./gtm-strategy.md)
- [Regulatory Standards Mapping](./regulatory-standards-mapping.md)
- [Strategic Navigation Flow](./strategic-navigation-flow.md)

Refer to these documents for detailed architecture, strategy, compliance, and value proposition information tailored to mining, minerals, petrochemicals, and defence sectors.

## Cursor Rules and Development Guidelines

### Design Document Integration

When making development decisions or implementing features, **ALWAYS** reference and follow the established design documents:

1. **Why Statement** - Use for:
   - Understanding the platform's purpose and motivation
   - Aligning features with the overall vision
   - Making decisions that support the mission
   - Ensuring stakeholder value delivery

2. **Problem Statement** - Use for:
   - Understanding what problems features should solve
   - Validating that solutions address real needs
   - Prioritizing features based on problem impact
   - Measuring success against problem resolution

3. **Solution Architecture Design (SAD)** - Use for:
   - Database schema decisions
   - API design patterns
   - Integration approaches
   - System component architecture
   - Error handling strategies

4. **UX Architecture Design** - Use for:
   - User interface patterns
   - User journey flows
   - Component design decisions
   - Accessibility considerations
   - User experience consistency

5. **Reference Architecture** - Use for:
   - Layered architecture decisions
   - Control & Risk vertical implementation
   - Industry-specific requirements
   - Regulatory compliance patterns

6. **Product Backlog** - Use for:
   - Feature prioritisation
   - User story implementation
   - Phase-appropriate development
   - Success criteria validation

### Documentation as Code Practices

Following the [Docs as Code philosophy](https://www.writethedocs.org/guide/docs-as-code/), this project implements documentation using the same tools and workflows as code development:

#### Core Principles

- **Version Control:** All documentation is stored in Git alongside code
- **Plain Text Markup:** Documentation uses Markdown format
- **Code Reviews:** Documentation changes require review before merging
- **Automated Tests:** Documentation is validated and tested
- **Issue Tracking:** Documentation tasks are tracked in the same system as code

#### Documentation Workflow

1. **Create Documentation Issues:** Track documentation needs alongside feature development
2. **Write Documentation:** Use Markdown format with consistent structure
3. **Review Process:** Documentation changes go through the same review process as code
4. **Automated Validation:** Ensure links work, formatting is correct, and content is complete
5. **Version Control:** Tag documentation releases with code releases

#### Documentation Standards

- **Consistency:** Use established templates and formats
- **Clarity:** Write for the intended audience (developers, stakeholders, users)
- **Completeness:** Ensure all features have corresponding documentation
- **Currency:** Keep documentation updated with code changes
- **Accessibility:** Follow accessibility guidelines for documentation

#### Integration with Development

- **Feature Documentation:** New features must include documentation before merging
- **API Documentation:** All APIs must be documented with examples
- **Architecture Updates:** Significant architectural changes require documentation updates
- **User Guides:** User-facing features require user documentation
- **Technical Guides:** Complex implementations require technical documentation

### Development Decision Framework

When implementing any feature or making architectural decisions:

1. **Check Why Statement:** Ensure the feature aligns with the platform's purpose and vision
2. **Validate Problem Statement:** Confirm the feature addresses a real problem
3. **Check Design Documents:** Review relevant sections of SAD, UXD, and Reference Architecture
4. **Validate Against Backlog:** Ensure implementation aligns with prioritised features
5. **Update Documentation:** Modify design documents if implementation reveals new requirements
6. **Follow Documentation as Code:** Update documentation alongside code changes
7. **Maintain Consistency:** Ensure decisions align with established patterns and principles

### Quality Assurance

- **Documentation Reviews:** All documentation changes require peer review
- **Cross-Reference Validation:** Ensure documentation references are accurate and current
- **User Testing:** Validate that documentation meets user needs
- **Continuous Improvement:** Regularly review and improve documentation quality

---

## Contributing

When contributing to this project:

1. **Understand the Purpose:** Always reference the why statement and problem statement
2. **Follow the Design Documents:** Always reference the established architecture and UX patterns
3. **Update Documentation:** Keep documentation current with code changes
4. **Use Documentation as Code:** Follow the established workflow and tools
5. **Maintain Consistency:** Ensure all changes align with the overall design vision
6. **Validate Against Backlog:** Ensure contributions support the prioritised roadmap

For detailed contribution guidelines, refer to the individual design documents and the product backlog for current priorities and implementation phases. 