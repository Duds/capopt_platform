# CapOpt Platform - TODOs

## Canvas Share & Export Functionality

### 🚀 High Priority

#### 1. Fix Export Foreign Key Constraint
**Issue:** `Foreign key constraint violated on the constraint: canvas_exports_exportedById_fkey`
**Location:** `app/api/business-canvas/[id]/export/route.ts`
**Solution:** 
- [ ] Implement proper user authentication context
- [ ] Replace `'system'` with actual user ID from auth context
- [ ] Add user validation before creating export records

#### 2. Fix Share Foreign Key Constraint  
**Issue:** Similar foreign key constraint issue in share functionality
**Location:** `app/api/business-canvas/[id]/share/route.ts`
**Solution:**
- [ ] Implement proper user authentication context
- [ ] Replace `'system'` with actual user ID from auth context
- [ ] Add user validation before creating share records

### 📋 Medium Priority

#### 3. Implement Canvas Export File Generation
**Current Status:** Only JSON export works, others return placeholders
**Location:** `app/api/business-canvas/[id]/export/route.ts`

**Tasks:**
- [ ] **PDF Generation**
  - Research and select PDF generation library (puppeteer, jsPDF)
  - Create PDF template for business canvas layout
  - Implement canvas-to-PDF conversion
  - Add styling and branding to PDF output

- [ ] **Image Generation (PNG/SVG)**
  - Research canvas/SVG generation libraries
  - Create visual template for canvas sections
  - Implement canvas-to-image conversion
  - Add proper styling and layout

- [ ] **Data Export (CSV/EXCEL)**
  - Research spreadsheet generation libraries (xlsx, csv-writer)
  - Design data structure for spreadsheet export
  - Implement canvas data to spreadsheet conversion
  - Add proper formatting and headers

- [ ] **Technical Improvements**
  - Add file size limits and validation
  - Implement proper error handling for file generation failures
  - Add file compression and optimization
  - Update API to handle large file generation asynchronously

#### 4. Implement Canvas Share Email Functionality
**Current Status:** Email sharing creates database record but doesn't send emails
**Location:** `app/api/business-canvas/[id]/share/route.ts`

**Tasks:**
- [ ] **Email Service Integration**
  - Research and select email service (SendGrid, AWS SES, etc.)
  - Implement email sending functionality
  - Add email templates for canvas sharing
  - Add email tracking and delivery confirmation

- [ ] **Email Templates**
  - Create professional email templates
  - Add canvas preview in email
  - Include proper branding and styling
  - Add call-to-action buttons

- [ ] **Email Management**
  - Add email validation and sanitization
  - Implement rate limiting for email sending
  - Add email delivery status tracking
  - Handle email bounce and failure scenarios

#### 5. Implement Canvas Share Team Functionality
**Current Status:** Team sharing creates database record but doesn't notify team members
**Location:** `app/api/business-canvas/[id]/share/route.ts`

**Tasks:**
- [ ] **Team Notification System**
  - Implement team member discovery
  - Add team member validation
  - Create team-wide notification system
  - Add team notification preferences

- [ ] **Team Management**
  - Add team member roles and permissions
  - Implement team hierarchy support
  - Add team-wide access controls
  - Create team activity feeds

### 🔧 Low Priority

#### 6. Enhance Share & Export UI
**Location:** `components/business-canvas/canvas-visualization.tsx`

**Tasks:**
- [ ] **Export History**
  - Add export history display
  - Show recent exports with download links
  - Add export analytics and usage tracking

- [ ] **Share Management**
  - Add share history display
  - Show active shares with management options
  - Add share analytics and tracking

- [ ] **UI Improvements**
  - Add progress indicators for file generation
  - Improve error messages and user feedback
  - Add export/share preferences
  - Implement drag-and-drop for file uploads

#### 7. Add Export & Share Analytics
**Tasks:**
- [ ] **Usage Tracking**
  - Track export frequency and formats
  - Monitor share activity and engagement
  - Add user behavior analytics

- [ ] **Performance Monitoring**
  - Monitor file generation performance
  - Track API response times
  - Add error rate monitoring

## GitHub Issues to Create

### Issue 1: Fix Export/Share Foreign Key Constraints
**Title:** Fix Export and Share Foreign Key Constraint Violations
**Labels:** `bug`, `high-priority`, `authentication`
**Description:** Both export and share functionality are failing due to foreign key constraint violations on user references.

### Issue 2: Implement Canvas Export File Generation
**Title:** Implement Canvas Export File Generation for All Formats
**Labels:** `enhancement`, `export`, `file-generation`
**Description:** Currently only JSON export works. Need to implement actual file generation for PDF, PNG, SVG, CSV, and EXCEL formats.

### Issue 3: Implement Canvas Share Email Functionality
**Title:** Implement Email Sending for Canvas Sharing
**Labels:** `enhancement`, `share`, `email`
**Description:** Email sharing creates database records but doesn't actually send emails. Need to implement email service integration.

### Issue 4: Implement Canvas Share Team Functionality
**Title:** Implement Team Notifications for Canvas Sharing
**Labels:** `enhancement`, `share`, `team`
**Description:** Team sharing creates database records but doesn't notify team members. Need to implement team notification system.

### Issue 5: Add Export and Share Analytics
**Title:** Add Analytics for Export and Share Functionality
**Labels:** `enhancement`, `analytics`, `monitoring`
**Description:** Add usage tracking, performance monitoring, and user behavior analytics for export and share features.

## Implementation Notes

### Dependencies to Add
```json
{
  "puppeteer": "^21.0.0",
  "jspdf": "^2.5.0",
  "xlsx": "^0.18.0",
  "canvas": "^2.11.0",
  "nodemailer": "^6.9.0",
  "@sendgrid/mail": "^7.7.0"
}
```

### Environment Variables Needed
```env
# Email Service
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@capopt.com

# File Storage (for generated files)
AWS_S3_BUCKET=capopt-exports
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
```

### Database Considerations
- Consider adding indexes on `canvas_exports.exportedById` and `canvas_sharing_settings.businessCanvasId`
- Add soft delete for export and share records
- Consider archiving old export/share records

## Success Criteria
- [ ] All export formats generate actual files
- [ ] Email sharing sends actual emails
- [ ] Team sharing notifies team members
- [ ] No foreign key constraint violations
- [ ] Proper error handling and user feedback
- [ ] Performance is acceptable for large canvases 