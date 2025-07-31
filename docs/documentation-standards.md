# Documentation as Code Standards

## Core Principles
Following the [Docs as Code philosophy](https://www.writethedocs.org/guide/docs-as-code/), this project implements documentation using the same tools and workflows as code development.

### Documentation as Code Workflow
1. **Version Control:** All documentation stored in Git alongside code
2. **Plain Text Markup:** Documentation uses Markdown format
3. **Code Reviews:** Documentation changes require review before merging
4. **Automated Tests:** Documentation is validated and tested
5. **Issue Tracking:** Documentation tasks tracked in the same system as code

## Documentation Structure

### Design Documentation (`docs/design/`)
- **README.md:** Overview and navigation
- **solution-architecture-design.md:** Technical architecture and ERDs
- **ux-architecture-design.md:** User experience and interface design
- **reference-architecture.md:** Layered architecture and patterns
- **product-backlog.md:** Prioritised feature backlog
- **gtm-strategy.md:** Go-to-market strategy
- **regulatory-standards-mapping.md:** Compliance and standards
- **value-proposition.md:** Business value proposition

### Code Documentation
- **README.md:** Project overview and setup
- **API Documentation:** All APIs must be documented
- **Component Documentation:** Complex components require documentation
- **Architecture Documentation:** System architecture and patterns

## Documentation Standards

### Markdown Formatting
- **Use consistent heading structure** (H1, H2, H3, etc.)
- **Include table of contents** for long documents
- **Use code blocks** with language specification
- **Include diagrams** using Mermaid or PlantUML
- **Use proper link formatting** for internal and external references

### Content Guidelines
- **Write for the intended audience** (developers, stakeholders, users)
- **Use clear, concise language** with Australian English spelling
- **Include examples** and code snippets where appropriate
- **Provide context** and background information
- **Keep content current** with code changes

### Documentation Requirements by Feature Type

#### New Features
- **Feature description** and purpose
- **User stories** and acceptance criteria
- **Technical implementation** details
- **API documentation** if applicable
- **User guide** for user-facing features

#### API Changes
- **Endpoint documentation** with examples
- **Request/response schemas**
- **Authentication requirements**
- **Error handling** and status codes
- **Usage examples**

#### Architecture Changes
- **Updated architecture diagrams**
- **Design rationale** and decisions
- **Impact analysis** on existing systems
- **Migration guides** if needed

## Documentation References and Cross-Linking

### Using @docs/ References

The project uses a standardized `@docs/` reference system to create clear, maintainable links between documentation files and code.

#### Reference Format
```
@docs/filename.md
@docs/category/filename.md
@docs/category/subcategory/filename.md
```

#### When to Use @docs/ References

**Use @docs/ references when:**
- **Referencing design documents** in code comments
- **Linking to architecture decisions** in implementation
- **Connecting features to requirements** in documentation
- **Cross-referencing related documentation** files
- **Linking to API documentation** from code
- **Referencing user guides** from feature descriptions

**Examples:**
```typescript
/**
 * Business Canvas Management Component
 * 
 * Implements the business model canvas functionality as defined in
 * @docs/design/solution-architecture-design.md#business-canvas
 * 
 * User interface follows patterns established in
 * @docs/design/ux-architecture-design.md#canvas-components
 * 
 * Feature requirements documented in
 * @docs/design/product-backlog.md#business-canvas-management
 */
```

```markdown
## Implementation Status

This feature implements the strategic navigation flow described in
@docs/design/strategic-navigation-flow.md#process-to-service-model

For technical details, see @docs/technical/business-canvas-enhancement-summary.md

User guide available at @docs/user-guides/business-canvas-usage.md
```

#### Reference Categories

**Design Documents:**
- `@docs/design/solution-architecture-design.md` - Technical architecture
- `@docs/design/ux-architecture-design.md` - User experience design
- `@docs/design/reference-architecture.md` - Layered architecture
- `@docs/design/product-backlog.md` - Feature requirements
- `@docs/design/strategic-navigation-flow.md` - Navigation patterns

**Technical Documentation:**
- `@docs/technical-implementation-details.md` - Technical implementation
- `@docs/api-endpoints.md` - API documentation
- `@docs/debugging-guide.md` - Debugging information

**Implementation Status:**
- `@docs/implementation-status.md` - Overall project status
- `@docs/implementation-status/canvas-status-management-implementation.md` - Specific feature status

**User Documentation:**
- `@docs/user-guides/` - User-facing documentation
- `@docs/api-endpoints.md` - API reference

#### Reference Maintenance

**Best Practices:**
1. **Use descriptive filenames** that clearly indicate content
2. **Keep references current** when files are moved or renamed
3. **Validate references** during documentation reviews
4. **Use consistent formatting** for all @docs/ references
5. **Include context** when referencing specific sections

**Validation:**
- **Automated link checking** in CI/CD pipeline
- **Manual review** of references during documentation updates
- **Cross-reference validation** when files are moved
- **Broken link detection** and reporting

#### Reference Examples by Context

**Code Comments:**
```typescript
// Follows authentication patterns from @docs/design/solution-architecture-design.md#authentication
// Implements RBAC as defined in @docs/design/reference-architecture.md#role-based-access-control
// UI patterns from @docs/design/ux-architecture-design.md#user-interface-patterns
```

**README Files:**
```markdown
## Architecture

This project follows the layered architecture described in @docs/design/reference-architecture.md

For implementation details, see @docs/technical-implementation-details.md

Current status available at @docs/implementation-status.md
```

**Feature Documentation:**
```markdown
## Business Canvas Management

This feature implements the business model canvas functionality as specified in
@docs/design/product-backlog.md#business-canvas-management

Technical implementation follows patterns in @docs/design/solution-architecture-design.md#business-canvas

User interface design documented in @docs/design/ux-architecture-design.md#canvas-components
```

**API Documentation:**
```markdown
## Authentication Endpoints

Authentication follows the security standards defined in @docs/design/solution-architecture-design.md#security

For detailed API reference, see @docs/api-endpoints.md#authentication

Implementation status tracked in @docs/implementation-status.md#authentication
```

## Documentation Workflow

### Creating Documentation
1. **Create documentation issue** alongside feature development
2. **Write documentation** using Markdown format
3. **Include diagrams** and visual aids where helpful
4. **Add @docs/ references** to related documentation
5. **Review and validate** content accuracy
6. **Submit for review** with code changes

### Review Process
- **Peer review** required for all documentation changes
- **Technical accuracy** validation
- **Content clarity** and completeness review
- **Formatting and style** consistency check
- **Link validation** and cross-reference verification
- **@docs/ reference validation** and maintenance

### Maintenance
- **Regular reviews** of documentation currency
- **Update documentation** alongside code changes
- **Remove outdated** or obsolete content
- **Validate links** and references
- **Maintain @docs/ references** when files are moved
- **Improve clarity** based on user feedback

## Documentation Tools and Automation

### Validation Tools
- **Markdown linting** for formatting consistency
- **Link checking** for broken references
- **@docs/ reference validation** for cross-references
- **Spell checking** for content quality
- **Diagram validation** for visual content

### Automation
- **Automated link validation** in CI/CD pipeline
- **@docs/ reference checking** for broken cross-references
- **Documentation generation** from code comments
- **Version tagging** with code releases
- **Change tracking** and audit trails

## Quality Assurance

### Documentation Reviews
- **Content accuracy** and technical correctness
- **Clarity and readability** for target audience
- **Completeness** and coverage of required topics
- **Consistency** with project standards and style
- **@docs/ reference accuracy** and maintenance

### User Testing
- **Validate documentation** meets user needs
- **Test usability** and navigation
- **Verify cross-references** are helpful and accurate
- **Gather feedback** from actual users
- **Iterate and improve** based on feedback

### Continuous Improvement
- **Regular documentation audits**
- **User feedback collection** and analysis
- **Process improvement** based on lessons learned
- **Tool and workflow optimization**
- **@docs/ reference system enhancement**

## Documentation Templates

### Feature Documentation Template
```markdown
# Feature Name

## Overview
Brief description of the feature and its purpose.

## Requirements
Based on requirements in @docs/design/product-backlog.md#feature-name

## Technical Implementation
Follows patterns established in @docs/design/solution-architecture-design.md#feature-section

## User Interface
Implements design patterns from @docs/design/ux-architecture-design.md#ui-patterns

## API Documentation
If applicable, include API endpoints and examples.

## User Guide
Step-by-step instructions for using the feature.

## Testing
Information about testing the feature.

## Related Documentation
- @docs/design/product-backlog.md#feature-name
- @docs/technical-implementation-details.md#feature-section
- @docs/user-guides/feature-usage.md
```

### API Documentation Template
```markdown
# API Endpoint Name

## Endpoint
`GET /api/v1/resource`

## Description
Brief description of what the endpoint does.

## Authentication
Follows patterns in @docs/design/solution-architecture-design.md#authentication

## Parameters
| Parameter | Type | Required | Description |
|-----|---|----|----|
| id | string | Yes | Resource identifier |

## Response
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

## Error Responses
Common error responses and their meanings.

## Examples
Usage examples with sample requests and responses.

## Related Documentation
- @docs/api-endpoints.md#resource-endpoints
- @docs/design/solution-architecture-design.md#api-design
``` 