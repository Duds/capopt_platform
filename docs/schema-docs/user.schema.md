# User Entity Schema Documentation

## Entity Overview
- **Test ID Prefix:** `test-user-`
- **Prisma Model:** `User`
- **Seed File:** `/prisma/seed/users/index.ts`
- **Linked ERD:** `/docs/design/solution-architecture-design.md#user-management`

## Schema Definition

### Core Fields
| Field | Type | Required | Test ID | Description |
|-------|------|----------|---------|-------------|
| `id` | String | ✅ | - | Unique identifier (CUID) |
| `email` | String | ✅ | `test-input-email` | Unique email address |
| `name` | String | ✅ | `test-input-name` | User's full name |
| `password` | String | ✅ | `test-input-password` | Hashed password |
| `role` | UserRole | ✅ | `test-input-role` | User's role in system |
| `isActive` | Boolean | ✅ | `test-user-status-active` | Account active status |
| `lastLogin` | DateTime | ❌ | `test-user-last-login` | Last login timestamp |
| `createdAt` | DateTime | ✅ | - | Record creation timestamp |
| `updatedAt` | DateTime | ✅ | - | Record update timestamp |

### Relationship Fields
| Field | Type | Required | Test ID | Description |
|-------|------|----------|---------|-------------|
| `enterpriseId` | String | ❌ | `test-input-enterprise` | Associated enterprise |
| `departmentId` | String | ❌ | `test-input-department` | Associated department |

## UserRole Enum Values
- `ADMIN` - System administrator
- `MANAGER` - Department/team manager
- `USER` - Standard user
- `AUDITOR` - Internal auditor
- `SUPERADMIN` - Super administrator
- `SECURITY_OFFICER` - Security officer
- `DATA_STEWARD` - Data steward
- `PROCESS_OWNER` - Process owner
- `CONTROL_OWNER` - Control owner
- `VIEWER` - Read-only access
- `EXTERNAL_AUDITOR` - External auditor
- `MAINTENANCE` - Maintenance user
- `DOCUMENTATION_SPECIALIST` - Documentation specialist

## Testing Guidelines

### Component Test IDs
```typescript
// Import from lib/testSelectors.ts
import { userTestIds } from '@/lib/testSelectors';

// User card component
<div data-testid={userTestIds.userCard}>
  <h3>{user.name}</h3>
  <p>{user.email}</p>
  <span data-testid={userTestIds.userStatusActive}>
    {user.isActive ? 'Active' : 'Inactive'}
  </span>
</div>

// User form component
<form data-testid={userTestIds.userForm}>
  <input data-testid={userTestIds.inputName} name="name" />
  <input data-testid={userTestIds.inputEmail} name="email" />
  <select data-testid={userTestIds.inputRole} name="role">
    {/* role options */}
  </select>
  <button data-testid={userTestIds.userSaveButton}>Save</button>
</form>
```

### Test Data Requirements
- Use realistic Australian names and email addresses
- Follow Australian business naming conventions
- Use appropriate role assignments based on enterprise context
- Ensure password complexity requirements are met
- Validate email format and uniqueness

### Validation Rules
- Email must be unique across all users
- Password must meet security requirements (min 8 chars, complexity)
- Name must be non-empty and properly formatted
- Role must be a valid UserRole enum value
- Enterprise and department IDs must reference valid entities

### Seed Data Alignment
Test data should align with seed files in `/prisma/seed/users/`:
- Admin users for system administration
- Manager users for enterprise management
- Standard users for operational tasks
- Auditor users for compliance activities

## Related Entities
- **Enterprise** - Users belong to enterprises
- **Department** - Users can be assigned to departments
- **Process** - Users can create and manage processes
- **CriticalControl** - Users can create and manage controls
- **Asset** - Users can create and manage assets
- **MaturityAssessment** - Users can create assessments
- **AuditLog** - User actions are logged
- **BusinessCanvas** - Users can create and collaborate on canvases

## API Endpoints
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get current user profile

## Security Considerations
- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Role-based access control (RBAC)
- Session management and timeout
- Audit logging for user actions
- Input validation and sanitization 