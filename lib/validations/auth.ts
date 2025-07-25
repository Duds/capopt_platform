import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum([
    'ADMIN', 'MANAGER', 'USER', 'AUDITOR', 'SUPERADMIN', 'SECURITY_OFFICER', 
    'DATA_STEWARD', 'PROCESS_OWNER', 'CONTROL_OWNER', 'VIEWER', 
    'EXTERNAL_AUDITOR', 'MAINTENANCE', 'DOCUMENTATION_SPECIALIST'
  ]).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema> 