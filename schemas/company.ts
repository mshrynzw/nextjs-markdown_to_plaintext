import { z } from 'zod';

/**
 * 給与設定スキーマ
 */
export const PayrollSettingsSchema = z.object({
  // 締日・支払日設定
  payroll_cutoff_day: z.number().min(1).max(31), // 給与締日（日）
  payroll_payment_day: z.number().min(1).max(31), // 給与支払日（日）
  is_auto_payroll_calculation: z.boolean(), // 給与自動計算フラグ（true: 自動計算, false: 手動計算）
  auto_payroll_calculation_time: z.string().datetime(), // 給与自動計算時間（時:分）

  // 社会保険料率
  social_insurance_rates: z.object({
    health_insurance_rate: z.number().min(0).max(1), // 健康保険料率（0.1 = 10%）
    employee_pension_rate: z.number().min(0).max(1), // 厚生年金保険料率
    employment_insurance_rate: z.number().min(0).max(1), // 雇用保険料率
  }),

  // 手当制度
  allowance_settings: z.object({
    commuting_allowance_fixed: z.number().min(0), // 通勤手当一律額
    housing_allowance_fixed: z.number().min(0), // 住宅手当固定額
    commuting_allowance_enabled: z.boolean(), // 通勤手当制度の有無
    housing_allowance_enabled: z.boolean(), // 住宅手当制度の有無
  }),
});

/**
 * 会社
 */
export const CompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  application_name: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string(),
  payroll_settings: PayrollSettingsSchema,
});

export type PayrollSettings = z.infer<typeof PayrollSettingsSchema>;
export type Company = z.infer<typeof CompanySchema>;
