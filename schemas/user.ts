import { z } from 'zod';

import { CompanySchema } from './company';
import { GroupSchema } from './group';
import { UserFixedValuesSchema } from './payroll';
/**
 * ユーザーロールスキーマ
 */
export const UserRoleSchema = z.enum(['system-admin', 'admin', 'member']);

/**
 * 認証ユーザースキーマ
 */
export const UserSchema = z.object({
  id: z.string().uuid(),
  family_name: z.string(),
  first_name: z.string(),
  role: UserRoleSchema,
  email: z.string().email(),
  company: CompanySchema,
  primary_group: GroupSchema,
  employee_type: z.object({
    id: z.string(),
    name: z.string(),
  }),
  work_type: z.object({
    id: z.string(),
    name: z.string(),
  }),
  fixed_values: UserFixedValuesSchema, // ユーザー固定値
});

export type UserRole = z.infer<typeof UserRoleSchema>;
export type User = z.infer<typeof UserSchema>;
