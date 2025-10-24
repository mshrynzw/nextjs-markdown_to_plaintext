import { z } from 'zod';

import { EditHistorySchema as BaseEditHistorySchema } from './database/base';

// 給与ステータスのスキーマ
export const PayrollStatusSchema = z.enum(['未処理', '承認待ち', '承認済み', '支払完了']);

// 支給形態のスキーマ
export const PaymentTypeSchema = z.enum(['monthly', 'hourly', 'daily']); // 月給・時給・日給

// 課税区分のスキーマ
export const TaxCategorySchema = z.enum(['taxable', 'non_taxable']); // 課税・非課税

// 支給サイクルのスキーマ
export const PaymentCycleSchema = z.enum(['monthly', 'weekly']); // 月次・週次

// 端数処理のスキーマ
export const RoundingMethodSchema = z.enum(['round', 'floor', 'ceil']); // 四捨五入・切捨・切上

// 社会保険のスキーマ
export const SocialInsuranceSchema = z.object({
  health_insurance_rate: z.number().min(0).max(1), // 健康保険料率
  employee_pension_rate: z.number().min(0).max(1), // 厚生年金料率
  employment_insurance_rate: z.number().min(0).max(1), // 雇用保険料率
  health_insurance_type: z.string().optional(), // 健康保険種別（協会けんぽ/健保組合）
  standard_remuneration_grade: z.number().optional(), // 標準報酬月額等級
});

// 所得税区分のスキーマ
export const IncomeTaxCategorySchema = z.enum(['甲', '乙']); // 甲・乙

// 住民税徴収方法のスキーマ
export const ResidentTaxCollectionSchema = z.enum(['special_collection', 'ordinary_collection']); // 特別徴収・普通徴収

// 振込口座のスキーマ
export const BankAccountSchema = z.object({
  bank_name: z.string(), // 金融機関名
  branch_name: z.string(), // 支店名
  account_type: z.string(), // 口座種別（普通・当座等）
  account_number_masked: z.string(), // 口座番号（マスク済み）
});

// 支払方法のスキーマ
export const PaymentMethodSchema = z.enum(['full_transfer', 'partial_cash']); // 全額振込・一部現金

// ユーザー固定値のスキーマ（拡張版）
export const UserFixedValuesSchema = z.object({
  // 1) 支給設定
  base_salary: z.number().min(0), // 基本給
  payment_type: PaymentTypeSchema, // 支給形態（月給・時給・日給）
  standard_working_hours: z.number().min(0).optional(), // 所定労働時間（月160h等）
  overtime_rate: z.number().min(0).optional(), // 残業単価（自動算出）
  overtime_multiplier: z.number().min(0).optional(), // 割増率（25%/35%等）
  fixed_overtime: z
    .object({
      is_enabled: z.boolean(), // 固定残業の有無
      hours: z.number().min(0).optional(), // みなし時間
      excess_settlement: z.boolean().optional(), // 超過清算の有無
    })
    .optional(),
  commuting_allowance: z.object({
    amount: z.number().min(0), // 金額
    tax_category: TaxCategorySchema, // 課税/非課税
    route_memo: z.string().optional(), // 定期区間メモ
  }),
  housing_allowance: z.object({
    amount: z.number().min(0), // 金額
    tax_category: TaxCategorySchema, // 課税/非課税
  }),
  custom_allowances: z
    .array(
      z.object({
        name: z.string(), // 手当名称
        amount: z.number().min(0), // 金額
        tax_category: TaxCategorySchema, // 課税区分
      })
    )
    .optional(), // その他カスタム手当
  payment_cycle: PaymentCycleSchema, // 支給サイクル（月次/週次）
  cutoff_day: z.number().min(1).max(31).optional(), // 締日
  payment_day: z.number().min(1).max(31).optional(), // 支払日
  rounding_method: RoundingMethodSchema.optional(), // 端数処理（四捨五入/切捨/切上）
  absence_deduction_method: z.string().optional(), // 欠勤・遅早の控除方法

  // 2) 控除設定（保険・税）
  social_insurance: SocialInsuranceSchema, // 社会保険
  income_tax_category: IncomeTaxCategorySchema, // 源泉所得税区分（甲/乙）
  dependents_count: z.number().min(0).optional(), // 扶養人数
  basic_deduction_applied: z.boolean().optional(), // 基礎控除等の適用
  resident_tax_collection: ResidentTaxCollectionSchema, // 住民税徴収方法
  resident_tax_monthly_amount: z.number().min(0).optional(), // 住民税月額
  custom_deductions: z
    .array(
      z.object({
        name: z.string(), // 控除名称（社宅費、積立、貸与返済等）
        amount: z.number().min(0), // 金額
      })
    )
    .optional(), // その他社内控除

  // 3) 計算ルール
  amount_rounding: RoundingMethodSchema.optional(), // 金額の端数処理
  time_rounding: RoundingMethodSchema.optional(), // 時間の端数処理
  paid_leave_deduction: z.string().optional(), // 有休控除の扱い
  night_shift_multiplier: z.number().min(0).optional(), // 深夜割増率
  holiday_multiplier: z.number().min(0).optional(), // 休日割増率
  substitute_holiday_handling: z.string().optional(), // 代休・振替の扱い
  overtime_calculation_precision: z.number().min(0).optional(), // 残業計算の精度（小数第何位まで）
  minimum_wage_check: z.boolean().optional(), // 最低賃金チェック

  // 4) 支払設定
  bank_account: BankAccountSchema.optional(), // 振込口座
  payment_method: PaymentMethodSchema.optional(), // 支払方法
});

// 支給項目のスキーマ
export const PaymentItemSchema = z.object({
  base_salary: z.number().min(0), // 基本給
  overtime_allowance: z.number().min(0), // 残業手当
  commuting_allowance: z.number().min(0), // 通勤手当（会社設定に基づく）
  housing_allowance: z.number().min(0), // 住宅手当（会社設定に基づく）
  total_payment: z.number().min(0), // 総支給額
});

// 控除項目のスキーマ
export const DeductionItemSchema = z.object({
  health_insurance: z.number().min(0), // 健康保険（会社設定の料率に基づく）
  employee_pension: z.number().min(0), // 厚生年金（会社設定の料率に基づく）
  employment_insurance: z.number().min(0), // 雇用保険（会社設定の料率に基づく）
  income_tax: z.number().min(0), // 所得税
  resident_tax: z.number().min(0), // 住民税
  total_deduction: z.number().min(0), // 総控除額
});

// 勤怠データのスキーマ
export const AttendanceDataSchema = z.object({
  period: z.string(), // 対象期間（例: "2025年9月"）
  working_days: z.number().min(0), // 出勤日数
  actual_working_hours: z.object({
    normal_work: z.number().min(0), // 通常勤務時間
    overtime_hours: z.number().min(0), // 残業時間
    holiday_work: z.number().min(0), // 休日出勤時間
    total: z.number().min(0), // 実労働時間合計
  }),
  paid_leave_used: z.number().min(0), // 有給使用日数
  remaining_paid_leave: z.number().min(0), // 残有給日数
});

// 時給換算のスキーマ
export const HourlyRateSchema = z.object({
  base_hourly_rate: z.number().min(0), // 基本時給
  overtime_hourly_rate: z.number().min(0), // 残業時給
  effective_hourly_rate: z.number().min(0), // 実効時給
});

// 給与明細のメインスキーマ
export const PayrollSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  company_id: z.string(), // 会社ID（給与設定を参照するため）
  period_start: z.string().datetime(), // 対象期間開始日
  period_end: z.string().datetime(), // 対象期間終了日
  is_checked_by_member: z.boolean(), // 従業員確認済みフラグ
  status: PayrollStatusSchema, // 給与ステータス
  payment_items: PaymentItemSchema,
  deduction_items: DeductionItemSchema,
  net_payment: z.number().min(0), // 差引支給額
  attendance_data: AttendanceDataSchema,
  hourly_rates: HourlyRateSchema,
  payroll_date: z.string().datetime(), // 給与日時
  created_at: z.string().datetime(),
  updated_by: z.string(),
  updated_at: z.string().datetime(),
  /** 編集履歴 */
  edit_history: z.array(BaseEditHistorySchema).optional(),
});

// 給与明細一覧用のスキーマ
export const PayrollListSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  period: z.string(),
  status: PayrollStatusSchema,
  net_payment: z.number().min(0),
  payroll_date: z.string().datetime(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// 給与明細作成用のスキーマ
export const CreatePayrollSchema = z.object({
  user_id: z.string(),
  company_id: z.string(),
  period_start: z.string().datetime(),
  period_end: z.string().datetime(),
  payment_items: PaymentItemSchema.omit({ total_payment: true }),
  deduction_items: DeductionItemSchema.omit({ total_deduction: true }),
  attendance_data: AttendanceDataSchema,
  hourly_rates: HourlyRateSchema.omit({ effective_hourly_rate: true }),
});

// 給与明細更新用のスキーマ
export const UpdatePayrollSchema = CreatePayrollSchema.partial();

// 型定義のエクスポート
export type PayrollStatus = z.infer<typeof PayrollStatusSchema>;
export type UserFixedValues = z.infer<typeof UserFixedValuesSchema>;

// 新しいスキーマの型定義
export type PaymentType = z.infer<typeof PaymentTypeSchema>;
export type TaxCategory = z.infer<typeof TaxCategorySchema>;
export type PaymentCycle = z.infer<typeof PaymentCycleSchema>;
export type RoundingMethod = z.infer<typeof RoundingMethodSchema>;
export type SocialInsurance = z.infer<typeof SocialInsuranceSchema>;
export type IncomeTaxCategory = z.infer<typeof IncomeTaxCategorySchema>;
export type ResidentTaxCollection = z.infer<typeof ResidentTaxCollectionSchema>;
export type BankAccount = z.infer<typeof BankAccountSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type PaymentItem = z.infer<typeof PaymentItemSchema>;
export type DeductionItem = z.infer<typeof DeductionItemSchema>;
export type AttendanceData = z.infer<typeof AttendanceDataSchema>;
export type HourlyRate = z.infer<typeof HourlyRateSchema>;
export type Payroll = z.infer<typeof PayrollSchema>;
export type PayrollList = z.infer<typeof PayrollListSchema>;
export type CreatePayroll = z.infer<typeof CreatePayrollSchema>;
export type UpdatePayroll = z.infer<typeof UpdatePayrollSchema>;
