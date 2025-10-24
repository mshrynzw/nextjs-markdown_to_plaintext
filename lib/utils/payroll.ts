import type { DeductionItem, PaymentItem, PayrollSettings, Payroll, User } from '@/schemas';

/**
 * 給与計算ヘルパー関数
 */
export class PayrollCalculator {
  /**
   * 通勤手当を計算
   */
  static calculateCommutingAllowance(settings: PayrollSettings, baseSalary: number): number {
    if (!settings.allowance_settings.commuting_allowance_enabled) {
      return 0;
    }
    return settings.allowance_settings.commuting_allowance_fixed;
  }

  /**
   * 住宅手当を計算
   */
  static calculateHousingAllowance(settings: PayrollSettings, baseSalary: number): number {
    if (!settings.allowance_settings.housing_allowance_enabled) {
      return 0;
    }
    return settings.allowance_settings.housing_allowance_fixed;
  }

  /**
   * 社会保険料を計算
   */
  static calculateSocialInsurance(
    settings: PayrollSettings,
    baseSalary: number
  ): { health_insurance: number; employee_pension: number; employment_insurance: number } {
    const rates = settings.social_insurance_rates;

    return {
      health_insurance: Math.floor(baseSalary * rates.health_insurance_rate),
      employee_pension: Math.floor(baseSalary * rates.employee_pension_rate),
      employment_insurance: Math.floor(baseSalary * rates.employment_insurance_rate),
    };
  }

  /**
   * 支給項目を計算
   */
  static calculatePaymentItems(
    settings: PayrollSettings,
    baseSalary: number,
    overtimeAllowance: number
  ): PaymentItem {
    const commutingAllowance = this.calculateCommutingAllowance(settings, baseSalary);
    const housingAllowance = this.calculateHousingAllowance(settings, baseSalary);
    const totalPayment = baseSalary + overtimeAllowance + commutingAllowance + housingAllowance;

    return {
      base_salary: baseSalary,
      overtime_allowance: overtimeAllowance,
      commuting_allowance: commutingAllowance,
      housing_allowance: housingAllowance,
      total_payment: totalPayment,
    };
  }

  /**
   * 控除項目を計算
   */
  static calculateDeductionItems(
    settings: PayrollSettings,
    baseSalary: number,
    incomeTax: number,
    residentTax: number
  ): DeductionItem {
    const socialInsurance = this.calculateSocialInsurance(settings, baseSalary);
    const totalDeduction =
      socialInsurance.health_insurance +
      socialInsurance.employee_pension +
      socialInsurance.employment_insurance +
      incomeTax +
      residentTax;

    return {
      health_insurance: socialInsurance.health_insurance,
      employee_pension: socialInsurance.employee_pension,
      employment_insurance: socialInsurance.employment_insurance,
      income_tax: incomeTax,
      resident_tax: residentTax,
      total_deduction: totalDeduction,
    };
  }

  /**
   * 差引支給額を計算
   */
  static calculateNetPayment(paymentItems: PaymentItem, deductionItems: DeductionItem): number {
    return paymentItems.total_payment - deductionItems.total_deduction;
  }

  /**
   * 給与締日から支払日を計算
   */
  static calculatePayrollDate(settings: PayrollSettings, periodEnd: Date): Date {
    const paymentDay = settings.payroll_payment_day;
    const paymentDate = new Date(periodEnd);

    // 翌月の支払日を設定
    paymentDate.setMonth(paymentDate.getMonth() + 1);
    paymentDate.setDate(paymentDay);

    return paymentDate;
  }

  /**
   * 給与期間を計算
   */
  static calculatePayrollPeriod(
    settings: PayrollSettings,
    year: number,
    month: number
  ): { start: Date; end: Date } {
    const cutoffDay = settings.payroll_cutoff_day;

    // 当月の締日
    const periodEnd = new Date(year, month - 1, cutoffDay);

    // 前月の締日の翌日が期間開始
    const periodStart = new Date(year, month - 2, cutoffDay + 1);

    return { start: periodStart, end: periodEnd };
  }

  /**
   * 残業手当を計算
   */
  static calculateOvertimeAllowance(
    settings: PayrollSettings,
    overtimeHours: number,
    hourlyRate: number
  ): number {
    if (overtimeHours <= 0) return 0;

    // 既存の残業倍率を使用（デフォルト1.25倍）
    const overtimeRate = 1.25;
    return Math.floor(overtimeHours * hourlyRate * overtimeRate);
  }

  /**
   * 時給を計算
   */
  static calculateHourlyRate(baseSalary: number, workingDays: number): number {
    if (workingDays <= 0) return 0;
    return Math.floor(baseSalary / (workingDays * 8)); // 1日8時間として計算
  }

  /**
   * 給与を再計算
   */
  static recalculatePayroll(payroll: Payroll, user: User, settings: PayrollSettings): Payroll {
    const { attendance_data } = payroll;
    const { actual_working_hours, working_days } = attendance_data;

    // 基本給（既存の値を使用）
    const baseSalary = payroll.payment_items.base_salary;

    // 時給を計算
    const hourlyRate = this.calculateHourlyRate(baseSalary, working_days);

    // 残業手当を計算
    const overtimeHours = actual_working_hours.overtime_hours;
    const overtimeAllowance = this.calculateOvertimeAllowance(settings, overtimeHours, hourlyRate);

    // 支給項目を再計算
    const paymentItems = this.calculatePaymentItems(settings, baseSalary, overtimeAllowance);

    // 控除項目を再計算（既存の税金等は保持）
    const deductionItems = this.calculateDeductionItems(
      settings,
      baseSalary,
      payroll.deduction_items.income_tax,
      payroll.deduction_items.resident_tax
    );

    // 差引支給額を再計算
    const netPayment = this.calculateNetPayment(paymentItems, deductionItems);

    return {
      ...payroll,
      payment_items: paymentItems,
      deduction_items: deductionItems,
      net_payment: netPayment,
    };
  }
}

/**
 * 通貨フォーマット関数
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount);
}
