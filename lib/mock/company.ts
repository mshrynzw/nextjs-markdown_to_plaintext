import { toZonedTime } from 'date-fns-tz';

import type { Company } from '@/schemas';

// 現在日時の前日を取得（日本時間）
const timeZone = 'Asia/Tokyo';
const today = new Date();
const jstToday = toZonedTime(today, timeZone);
const yesterday = new Date(jstToday);
yesterday.setDate(jstToday.getDate() - 1);
const payroll_cutoff_day = yesterday.getDate();

// payroll_cutoff_dayの+15日を計算
const payroll_payment_day = payroll_cutoff_day + 15;

export const initialCompanies: Company[] = [
  {
    id: '1',
    name: '株式会社テスト',
    code: 'test-company',
    application_name: 'TimePort',
    address: '東京都渋谷区1-1-1',
    phone: '03-1234-5678',
    email: 'info@test.co.jp',
    payroll_settings: {
      payroll_cutoff_day, // 現在日時の前日
      payroll_payment_day, // payroll_cutoff_dayの+15日
      is_auto_payroll_calculation: true,
      auto_payroll_calculation_time: '00:00',
      social_insurance_rates: {
        health_insurance_rate: 0.05, // 5%
        employee_pension_rate: 0.09, // 9%
        employment_insurance_rate: 0.003, // 0.3%
      },
      allowance_settings: {
        commuting_allowance_fixed: 15000, // 15,000円
        housing_allowance_fixed: 20000, // 20,000円
        commuting_allowance_enabled: true,
        housing_allowance_enabled: true,
      },
    },
  },
];
