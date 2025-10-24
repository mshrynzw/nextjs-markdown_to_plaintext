'use client';

import { Save, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Company } from '@/schemas';
import { formatDateWithDayOfWeek } from '@/lib/utils/datetime';

interface PayrollSettingsTabProps {
  company: Company | undefined;
  onSave: (formData: PayrollFormData) => void;
}

interface PayrollFormData {
  payroll_cutoff_day: number;
  payroll_payment_day: number;
  is_auto_payroll_calculation: boolean;
  auto_payroll_calculation_time: string;
  health_insurance_rate: number;
  employee_pension_rate: number;
  employment_insurance_rate: number;
  commuting_allowance_fixed: number;
  housing_allowance_fixed: number;
  commuting_allowance_enabled: boolean;
  housing_allowance_enabled: boolean;
}

export default function PayrollSettingsTab({ company, onSave }: PayrollSettingsTabProps) {
  const [formData, setFormData] = useState<PayrollFormData>({
    payroll_cutoff_day: 25,
    payroll_payment_day: 10,
    is_auto_payroll_calculation: true,
    auto_payroll_calculation_time: '10:00',
    health_insurance_rate: 0.05,
    employee_pension_rate: 0.09,
    employment_insurance_rate: 0.003,
    commuting_allowance_fixed: 15000,
    housing_allowance_fixed: 20000,
    commuting_allowance_enabled: true,
    housing_allowance_enabled: true,
  });

  // 次回給与計算日時を計算する関数
  const getNextPayrollCalculationDateTime = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const cutoffDay = formData.payroll_cutoff_day;

    // 今月の締め日
    const currentMonthCutoff = new Date(currentYear, currentMonth, cutoffDay);

    // 今月の締め日が過ぎている場合は来月の締め日
    const nextCutoff =
      now > currentMonthCutoff
        ? new Date(currentYear, currentMonth + 1, cutoffDay)
        : currentMonthCutoff;

    // 締め日の翌日
    const nextCalculationDate = new Date(nextCutoff);
    nextCalculationDate.setDate(nextCalculationDate.getDate() + 2);

    // 時間を設定
    const [hours, minutes] = formData.auto_payroll_calculation_time.split(':').map(Number);
    nextCalculationDate.setHours(hours, minutes, 0, 0);

    return nextCalculationDate;
  };

  // 会社データが変更されたときにフォームデータを更新
  useEffect(() => {
    if (company) {
      setFormData({
        payroll_cutoff_day: company.payroll_settings.payroll_cutoff_day,
        payroll_payment_day: company.payroll_settings.payroll_payment_day,
        is_auto_payroll_calculation: company.payroll_settings.is_auto_payroll_calculation,
        auto_payroll_calculation_time: company.payroll_settings.auto_payroll_calculation_time,
        health_insurance_rate:
          company.payroll_settings.social_insurance_rates.health_insurance_rate,
        employee_pension_rate:
          company.payroll_settings.social_insurance_rates.employee_pension_rate,
        employment_insurance_rate:
          company.payroll_settings.social_insurance_rates.employment_insurance_rate,
        commuting_allowance_fixed:
          company.payroll_settings.allowance_settings.commuting_allowance_fixed,
        housing_allowance_fixed:
          company.payroll_settings.allowance_settings.housing_allowance_fixed,
        commuting_allowance_enabled:
          company.payroll_settings.allowance_settings.commuting_allowance_enabled,
        housing_allowance_enabled:
          company.payroll_settings.allowance_settings.housing_allowance_enabled,
      });
    }
  }, [company]);

  const handleInputChange = (field: string, value: number | boolean | string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Card className='bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Settings className='w-5 h-5' />
          給与設定
        </CardTitle>
        <CardDescription>給与計算に関する設定</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* 給与計算式の説明 */}
        <div className='space-y-4 pt-6 border-t'>
          <h3 className='text-lg font-medium'>給与計算式</h3>
          <div className='bg-gray-50 p-4 rounded-lg space-y-3'>
            <div className='flex flex-col lg:grid lg:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <h4 className='font-medium text-blue-600'>支給項目</h4>
                <div className='text-sm space-y-1 ml-4'>
                  <div>• 基本給 = 設定された基本給</div>
                  <div>• 残業手当 = 残業時間 × (基本給 ÷ 160時間) × 1.25</div>
                  <div>
                    • 通勤手当 ={' '}
                    {formData.commuting_allowance_enabled
                      ? `${formData.commuting_allowance_fixed.toLocaleString()}円`
                      : '無効'}
                  </div>
                  <div>
                    • 住宅手当 ={' '}
                    {formData.housing_allowance_enabled
                      ? `${formData.housing_allowance_fixed.toLocaleString()}円`
                      : '無効'}
                  </div>
                  <div>
                    • <strong>支給合計 = 基本給 + 残業手当 + 通勤手当 + 住宅手当</strong>
                  </div>
                </div>
              </div>

              <div className='space-y-2'>
                <h4 className='font-medium text-red-600'>控除項目</h4>
                <div className='text-sm space-y-1 ml-4'>
                  <div>• 健康保険料 = 基本給 × {formData.health_insurance_rate * 100}%</div>
                  <div>• 厚生年金保険料 = 基本給 × {formData.employee_pension_rate * 100}%</div>
                  <div>• 雇用保険料 = 基本給 × {formData.employment_insurance_rate * 100}%</div>
                  <div>• 所得税 = 支給合計 × 所得税率（個人設定）</div>
                  <div>• 住民税 = 支給合計 × 住民税率（個人設定）</div>
                  <div>
                    •{' '}
                    <strong>
                      控除合計 = 健康保険料 + 厚生年金保険料 + 雇用保険料 + 所得税 + 住民税
                    </strong>
                  </div>
                </div>
              </div>

              <div className='space-y-2'>
                <h4 className='font-medium text-green-600'>最終計算</h4>
                <div className='text-sm ml-4'>
                  <div>
                    <strong>差引支給額 = 支給合計 - 控除合計</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className='text-xs text-gray-500 pt-2 border-t'>
              <p>
                ※ 給与期間は毎月{formData.payroll_cutoff_day}
                日締め、支払日は翌月
                {formData.payroll_payment_day}日です。
              </p>
              <p>※ 残業手当は1.25倍率で計算されます（法定時間外労働手当）。</p>
              <p>※ 社会保険料は基本給を基準に計算されます。</p>
            </div>
          </div>
        </div>

        <div className='space-y-4 pt-6 border-t'>
          <h3 className='text-lg font-medium'>給与設定</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <Label htmlFor='payroll-cutoff-day'>締め日</Label>
              <Input
                id='payroll-cutoff-day'
                type='number'
                min='1'
                max='31'
                value={formData.payroll_cutoff_day}
                onChange={(e) => handleInputChange('payroll_cutoff_day', parseInt(e.target.value))}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='payroll-payment-day'>支払日</Label>
              <Input
                id='payroll-payment-day'
                type='number'
                min='1'
                max='31'
                value={formData.payroll_payment_day}
                onChange={(e) => handleInputChange('payroll_payment_day', parseInt(e.target.value))}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='is-auto-payroll-calculation'>自動計算の有効化</Label>
              <div className='flex items-center space-x-2'>
                <Switch
                  id='is-auto-payroll-calculation'
                  checked={formData.is_auto_payroll_calculation}
                  onCheckedChange={(checked: boolean) =>
                    handleInputChange('is_auto_payroll_calculation', checked)
                  }
                />
              </div>
              <div className='text-xs text-gray-500'>
                ※ 自動計算を有効にすると、給与計算が自動的に行われます。
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='health-auto_payroll_calculation_time-rate'>自動計算の時刻設定</Label>
              <Input
                id='health-insurance-auto_payroll_calculation_time'
                type='time'
                value={formData.auto_payroll_calculation_time}
                onChange={(e) => handleInputChange('auto_payroll_calculation_time', e.target.value)}
              />
              <div className='text-xs text-gray-500'>
                ※ 次回は
                {formatDateWithDayOfWeek(
                  getNextPayrollCalculationDateTime().toISOString().split('T')[0]
                )}
                {formData.auto_payroll_calculation_time} に自動で給与計算が行われます。
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='health-insurance-rate'>健康保険料率 (%)</Label>
              <Input
                id='health-insurance-rate'
                type='number'
                step='0.001'
                min='0'
                max='1'
                value={formData.health_insurance_rate * 100}
                onChange={(e) =>
                  handleInputChange('health_insurance_rate', parseFloat(e.target.value) / 100)
                }
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='employee-pension-rate'>厚生年金保険料率 (%)</Label>
              <Input
                id='employee-pension-rate'
                type='number'
                step='0.001'
                min='0'
                max='1'
                value={formData.employee_pension_rate * 100}
                onChange={(e) =>
                  handleInputChange('employee_pension_rate', parseFloat(e.target.value) / 100)
                }
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='employment-insurance-rate'>雇用保険料率 (%)</Label>
              <Input
                id='employment-insurance-rate'
                type='number'
                step='0.001'
                min='0'
                max='1'
                value={formData.employment_insurance_rate * 100}
                onChange={(e) =>
                  handleInputChange('employment_insurance_rate', parseFloat(e.target.value) / 100)
                }
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='commuting-allowance-fixed'>通勤手当 (円)</Label>
              <Input
                id='commuting-allowance-fixed'
                type='number'
                value={formData.commuting_allowance_fixed}
                onChange={(e) =>
                  handleInputChange('commuting_allowance_fixed', parseInt(e.target.value))
                }
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='housing-allowance-fixed'>住宅手当 (円)</Label>
              <Input
                id='housing-allowance-fixed'
                type='number'
                value={formData.housing_allowance_fixed}
                onChange={(e) =>
                  handleInputChange('housing_allowance_fixed', parseInt(e.target.value))
                }
              />
            </div>

            <div className='space-y-4'>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='commuting-allowance-enabled'
                  checked={formData.commuting_allowance_enabled}
                  onCheckedChange={(checked: boolean) =>
                    handleInputChange('commuting_allowance_enabled', checked)
                  }
                />
                <Label htmlFor='commuting-allowance-enabled'>通勤手当を有効にする</Label>
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='housing-allowance-enabled'
                  checked={formData.housing_allowance_enabled}
                  onCheckedChange={(checked: boolean) =>
                    handleInputChange('housing_allowance_enabled', checked)
                  }
                />
                <Label htmlFor='housing-allowance-enabled'>住宅手当を有効にする</Label>
              </div>
            </div>
          </div>
        </div>

        <div className='flex justify-end pt-4 border-t'>
          <Button onClick={handleSave} className='flex items-center space-x-2'>
            <Save className='w-4 h-4' />
            <span>保存</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
