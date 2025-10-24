import { z } from 'zod';

export const SettingSchema = z.object({
  id: z.string(),
  admin_ratio: z.number(),
  attendance_history_ratio: z.number(),
  payroll_history_ratio: z.number(),
  month_offset: z.number(),
  employee_count: z.number(),
  mode: z.enum(['normal', 'warning', 'alert']),
});

export type Setting = z.infer<typeof SettingSchema>;
