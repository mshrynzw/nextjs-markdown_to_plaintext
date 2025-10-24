import type { Company, User } from '@/schemas';

export default function getInitialUser(company: Company): User {
  return {
    id: '1',
    family_name: '山田',
    first_name: '太郎',
    role: 'admin',
    email: 'test@example.com',
    company: company,
    primary_group: {
      id: '1',
      name: '総務課',
    },
    employee_type: {
      id: '0',
      name: '正社員',
    },
    work_type: {
      id: '0',
      name: '通常勤務',
    },
    fixed_values: {
      base_salary: 200000,
      payment_type: 'monthly',
      standard_working_hours: 160,
      overtime_rate: 1250,
      overtime_multiplier: 1.25,
      commuting_allowance: {
        amount: 15000,
        tax_category: 'taxable',
        route_memo: 'JR山手線 新宿駅〜渋谷駅',
      },
      housing_allowance: {
        amount: 20000,
        tax_category: 'taxable',
      },
      payment_cycle: 'monthly',
      cutoff_day: 25,
      payment_day: 10,
      rounding_method: 'round',
      social_insurance: {
        health_insurance_rate: 0.05,
        employee_pension_rate: 0.0915,
        employment_insurance_rate: 0.005,
        health_insurance_type: '協会けんぽ',
        standard_remuneration_grade: 20,
      },
      income_tax_category: '甲',
      dependents_count: 0,
      basic_deduction_applied: true,
      resident_tax_collection: 'special_collection',
      resident_tax_monthly_amount: 5000,
      amount_rounding: 'round',
      time_rounding: 'round',
      minimum_wage_check: true,
      payment_method: 'full_transfer',
    },
  };
}
