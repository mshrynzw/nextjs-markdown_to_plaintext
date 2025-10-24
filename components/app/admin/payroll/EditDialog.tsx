'use client';

import { History, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import TimeInput from '@/components/ui/time-input';
import { useMock } from '@/contexts/mock-context';
import { formatDateTime, getJSTDate } from '@/lib/utils/datetime';
import { getUserFullName, getUserNameById } from '@/lib/utils/user';
import type { Payroll } from '@/schemas';

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  payrollId: string | null;
}

export default function EditDialog({ isOpen, onClose, payrollId }: EditDialogProps) {
  const { payrolls, users, setPayrolls } = useMock();
  const [formData, setFormData] = useState<Payroll | null>(null);

  const payroll = payrolls.find((p) => p.id === payrollId);
  const user = users.find((u) => u.id === payroll?.user_id);

  useEffect(() => {
    if (payroll) {
      setFormData({ ...payroll });
    }
  }, [payroll]);

  if (!payroll || !user || !formData) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => {
      if (!prev) return prev;

      const newData = { ...prev };
      const keys = field.split('.');

      if (keys.length === 1) {
        (newData as Record<string, unknown>)[keys[0]] = value;
      } else if (keys.length === 2) {
        (newData as Record<string, unknown>)[keys[0]] = {
          ...((newData as Record<string, unknown>)[keys[0]] as Record<string, unknown>),
          [keys[1]]: value,
        };
      }

      return newData;
    });
  };

  const handleSave = () => {
    if (!formData) return;

    setPayrolls((prev) => prev.map((p) => (p.id === formData.id ? formData : p)));
    onClose();
  };

  const calculateTotalPayment = () => {
    const { base_salary, overtime_allowance, commuting_allowance, housing_allowance } =
      formData.payment_items;
    return base_salary + overtime_allowance + commuting_allowance + housing_allowance;
  };

  const calculateTotalDeduction = () => {
    const { health_insurance, employee_pension, employment_insurance, income_tax, resident_tax } =
      formData.deduction_items;
    return health_insurance + employee_pension + employment_insurance + income_tax + resident_tax;
  };

  const calculateNetPayment = () => {
    return calculateTotalPayment() - calculateTotalDeduction();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto bg-orange-100 rounded-md custom-scrollbar'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-gray-900'>給与明細編集</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* 基本情報 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>基本情報</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>従業員名</Label>
                  <p className='text-lg font-semibold'>
                    {getUserFullName(user.family_name, user.first_name)}
                  </p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>所属会社</Label>
                  <p className='text-lg'>{user.company.name}</p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>雇用形態</Label>
                  <p className='text-lg'>{user.work_type.name}</p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>期間</Label>
                  <p className='text-lg'>
                    {getJSTDate(new Date(formData.period_start))} ~{' '}
                    {getJSTDate(new Date(formData.period_end))}
                  </p>
                </div>
                <div>
                  <Label htmlFor='status'>ステータス</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='未処理'>未処理</SelectItem>
                      <SelectItem value='承認待ち'>承認待ち</SelectItem>
                      <SelectItem value='承認済み'>承認済み</SelectItem>
                      <SelectItem value='支払完了'>支払完了</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor='payroll_date'>給与日</Label>
                  <Input
                    id='payroll_date'
                    type='date'
                    value={formData.payroll_date.split('T')[0]}
                    onChange={(e) =>
                      handleInputChange('payroll_date', e.target.value + 'T00:00:00Z')
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 支給項目 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>支給項目</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <Label htmlFor='base_salary'>基本給</Label>
                  <Input
                    id='base_salary'
                    type='number'
                    value={formData.payment_items.base_salary}
                    onChange={(e) =>
                      handleInputChange('payment_items.base_salary', Number(e.target.value))
                    }
                    className='w-32 text-right'
                  />
                </div>
                <div className='flex justify-between items-center'>
                  <Label htmlFor='overtime_allowance'>残業手当</Label>
                  <Input
                    id='overtime_allowance'
                    type='number'
                    value={formData.payment_items.overtime_allowance}
                    onChange={(e) =>
                      handleInputChange('payment_items.overtime_allowance', Number(e.target.value))
                    }
                    className='w-32 text-right'
                  />
                </div>
                <div className='flex justify-between items-center'>
                  <Label htmlFor='commuting_allowance'>通勤手当</Label>
                  <Input
                    id='commuting_allowance'
                    type='number'
                    value={formData.payment_items.commuting_allowance}
                    onChange={(e) =>
                      handleInputChange('payment_items.commuting_allowance', Number(e.target.value))
                    }
                    className='w-32 text-right'
                  />
                </div>
                <div className='flex justify-between items-center'>
                  <Label htmlFor='housing_allowance'>住宅手当</Label>
                  <Input
                    id='housing_allowance'
                    type='number'
                    value={formData.payment_items.housing_allowance}
                    onChange={(e) =>
                      handleInputChange('payment_items.housing_allowance', Number(e.target.value))
                    }
                    className='w-32 text-right'
                  />
                </div>
                <Separator />
                <div className='flex justify-between items-center text-lg font-bold'>
                  <span>支給合計</span>
                  <span className='text-green-600'>{formatCurrency(calculateTotalPayment())}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 控除項目 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>控除項目</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <Label htmlFor='health_insurance'>健康保険</Label>
                  <Input
                    id='health_insurance'
                    type='number'
                    value={formData.deduction_items.health_insurance}
                    onChange={(e) =>
                      handleInputChange('deduction_items.health_insurance', Number(e.target.value))
                    }
                    className='w-32 text-right'
                  />
                </div>
                <div className='flex justify-between items-center'>
                  <Label htmlFor='employee_pension'>厚生年金</Label>
                  <Input
                    id='employee_pension'
                    type='number'
                    value={formData.deduction_items.employee_pension}
                    onChange={(e) =>
                      handleInputChange('deduction_items.employee_pension', Number(e.target.value))
                    }
                    className='w-32 text-right'
                  />
                </div>
                <div className='flex justify-between items-center'>
                  <Label htmlFor='employment_insurance'>雇用保険</Label>
                  <Input
                    id='employment_insurance'
                    type='number'
                    value={formData.deduction_items.employment_insurance}
                    onChange={(e) =>
                      handleInputChange(
                        'deduction_items.employment_insurance',
                        Number(e.target.value)
                      )
                    }
                    className='w-32 text-right'
                  />
                </div>
                <div className='flex justify-between items-center'>
                  <Label htmlFor='income_tax'>所得税</Label>
                  <Input
                    id='income_tax'
                    type='number'
                    value={formData.deduction_items.income_tax}
                    onChange={(e) =>
                      handleInputChange('deduction_items.income_tax', Number(e.target.value))
                    }
                    className='w-32 text-right'
                  />
                </div>
                <div className='flex justify-between items-center'>
                  <Label htmlFor='resident_tax'>住民税</Label>
                  <Input
                    id='resident_tax'
                    type='number'
                    value={formData.deduction_items.resident_tax}
                    onChange={(e) =>
                      handleInputChange('deduction_items.resident_tax', Number(e.target.value))
                    }
                    className='w-32 text-right'
                  />
                </div>
                <Separator />
                <div className='flex justify-between items-center text-lg font-bold'>
                  <span>控除合計</span>
                  <span className='text-red-600'>{formatCurrency(calculateTotalDeduction())}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 勤怠データ */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>勤怠データ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-6'>
                <div className='space-y-3'>
                  <div className='space-y-2'>
                    <Label htmlFor='working_days'>勤務日数</Label>
                    <div className='flex items-center gap-2'>
                      <Input
                        id='working_days'
                        type='number'
                        value={formData.attendance_data.working_days}
                        onChange={(e) =>
                          handleInputChange('attendance_data.working_days', Number(e.target.value))
                        }
                        className='w-24 text-right'
                      />
                      <div className='text-sm text-gray-600'>日</div>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='paid_leave_used'>有給休暇使用日数</Label>
                    <div className='flex items-center gap-2'>
                      <Input
                        id='paid_leave_used'
                        type='number'
                        value={formData.attendance_data.paid_leave_used}
                        onChange={(e) =>
                          handleInputChange(
                            'attendance_data.paid_leave_used',
                            Number(e.target.value)
                          )
                        }
                        className='w-24 text-right'
                      />
                      <div className='text-sm text-gray-600'>日</div>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='remaining_paid_leave'>有給休暇残日数</Label>
                    <div className='flex items-center gap-2'>
                      <Input
                        id='remaining_paid_leave'
                        type='number'
                        value={formData.attendance_data.remaining_paid_leave}
                        onChange={(e) =>
                          handleInputChange(
                            'attendance_data.remaining_paid_leave',
                            Number(e.target.value)
                          )
                        }
                        className='w-24 text-right'
                      />
                      <div className='text-sm text-gray-600'>日</div>
                    </div>
                  </div>
                </div>
                <div className='space-y-3'>
                  <TimeInput
                    label='通常勤務時間'
                    hours={Math.floor(formData.attendance_data.actual_working_hours.normal_work)}
                    minutes={Math.round(
                      (formData.attendance_data.actual_working_hours.normal_work % 1) * 60
                    )}
                    onHoursChange={(hours) => {
                      const totalHours =
                        hours + (formData.attendance_data.actual_working_hours.normal_work % 1);
                      handleInputChange(
                        'attendance_data.actual_working_hours.normal_work',
                        totalHours
                      );
                    }}
                    onMinutesChange={(minutes) => {
                      const totalHours =
                        Math.floor(formData.attendance_data.actual_working_hours.normal_work) +
                        minutes / 60;
                      handleInputChange(
                        'attendance_data.actual_working_hours.normal_work',
                        totalHours
                      );
                    }}
                  />
                  <TimeInput
                    label='残業時間'
                    hours={Math.floor(formData.attendance_data.actual_working_hours.overtime_hours)}
                    minutes={Math.round(
                      (formData.attendance_data.actual_working_hours.overtime_hours % 1) * 60
                    )}
                    onHoursChange={(hours) => {
                      const totalHours =
                        hours + (formData.attendance_data.actual_working_hours.overtime_hours % 1);
                      handleInputChange(
                        'attendance_data.actual_working_hours.overtime_hours',
                        totalHours
                      );
                    }}
                    onMinutesChange={(minutes) => {
                      const totalHours =
                        Math.floor(formData.attendance_data.actual_working_hours.overtime_hours) +
                        minutes / 60;
                      handleInputChange(
                        'attendance_data.actual_working_hours.overtime_hours',
                        totalHours
                      );
                    }}
                  />
                  <TimeInput
                    label='休日勤務時間'
                    hours={Math.floor(formData.attendance_data.actual_working_hours.holiday_work)}
                    minutes={Math.round(
                      (formData.attendance_data.actual_working_hours.holiday_work % 1) * 60
                    )}
                    onHoursChange={(hours) => {
                      const totalHours =
                        hours + (formData.attendance_data.actual_working_hours.holiday_work % 1);
                      handleInputChange(
                        'attendance_data.actual_working_hours.holiday_work',
                        totalHours
                      );
                    }}
                    onMinutesChange={(minutes) => {
                      const totalHours =
                        Math.floor(formData.attendance_data.actual_working_hours.holiday_work) +
                        minutes / 60;
                      handleInputChange(
                        'attendance_data.actual_working_hours.holiday_work',
                        totalHours
                      );
                    }}
                  />
                  <TimeInput
                    label='総勤務時間'
                    hours={Math.floor(formData.attendance_data.actual_working_hours.total)}
                    minutes={Math.round(
                      (formData.attendance_data.actual_working_hours.total % 1) * 60
                    )}
                    onHoursChange={(hours) => {
                      const totalHours =
                        hours + (formData.attendance_data.actual_working_hours.total % 1);
                      handleInputChange('attendance_data.actual_working_hours.total', totalHours);
                    }}
                    onMinutesChange={(minutes) => {
                      const totalHours =
                        Math.floor(formData.attendance_data.actual_working_hours.total) +
                        minutes / 60;
                      handleInputChange('attendance_data.actual_working_hours.total', totalHours);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 時給情報 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>時給情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <Label htmlFor='base_hourly_rate'>基本時給</Label>
                  <Input
                    id='base_hourly_rate'
                    type='number'
                    value={formData.hourly_rates.base_hourly_rate}
                    onChange={(e) =>
                      handleInputChange('hourly_rates.base_hourly_rate', Number(e.target.value))
                    }
                    className='text-right'
                  />
                </div>
                <div>
                  <Label htmlFor='overtime_hourly_rate'>残業時給</Label>
                  <Input
                    id='overtime_hourly_rate'
                    type='number'
                    value={formData.hourly_rates.overtime_hourly_rate}
                    onChange={(e) =>
                      handleInputChange('hourly_rates.overtime_hourly_rate', Number(e.target.value))
                    }
                    className='text-right'
                  />
                </div>
                <div>
                  <Label htmlFor='effective_hourly_rate'>実効時給</Label>
                  <Input
                    id='effective_hourly_rate'
                    type='number'
                    value={formData.hourly_rates.effective_hourly_rate}
                    onChange={(e) =>
                      handleInputChange(
                        'hourly_rates.effective_hourly_rate',
                        Number(e.target.value)
                      )
                    }
                    className='text-right'
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 最終支給額 */}
          <Card className='bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'>
            <CardContent className='p-6'>
              <div className='text-center'>
                <p className='text-lg font-medium text-gray-600 mb-2'>差引支給額</p>
                <p className='text-4xl font-bold text-blue-600'>
                  {formatCurrency(calculateNetPayment())}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 編集履歴 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <History className='w-4 h-4' />
                編集履歴
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formData.edit_history && formData.edit_history.length > 0 ? (
                <div className='space-y-4'>
                  {formData.edit_history.map((editItem, editIndex) => {
                    // 再計算の場合は変更内容を表示しない（ステータス変更を避けるため）
                    const isRecalculation = editItem.edit_reason.includes('再計算');
                    const mockChanges = isRecalculation
                      ? []
                      : [
                          {
                            fieldName: '基本給',
                            oldValue: '¥300,000',
                            newValue: '¥320,000',
                          },
                          {
                            fieldName: '残業手当',
                            oldValue: '¥0',
                            newValue: '¥25,000',
                          },
                        ];

                    return (
                      <div
                        key={`${formData.id}-${editIndex}`}
                        className='border rounded-lg p-4 bg-gray-50'
                      >
                        <div className='flex items-center justify-between mb-3'>
                          <div className='flex items-center gap-2'>
                            <span className='font-medium text-sm'>編集 {editIndex + 1}</span>
                            <Badge variant='outline' className='text-xs'>
                              {formatDateTime(editItem.edited_at)}
                            </Badge>
                          </div>
                          <span className='text-xs text-gray-600'>
                            編集者: {getUserNameById(editItem.edited_by, users)}
                          </span>
                        </div>

                        <div className='mb-3'>
                          <div className='text-sm text-gray-700 mb-2'>
                            <span className='font-medium'>編集理由:</span> {editItem.edit_reason}
                          </div>
                        </div>

                        {mockChanges.length > 0 && (
                          <div className='space-y-2'>
                            <div className='text-sm font-medium text-gray-700 mb-2'>変更内容:</div>
                            {mockChanges.map((change, changeIndex) => (
                              <div key={changeIndex} className='flex items-center gap-2 text-sm'>
                                <span className='font-medium text-gray-700 min-w-[120px]'>
                                  {change.fieldName}:
                                </span>
                                <span className='text-red-600 line-through'>{change.oldValue}</span>
                                <span className='text-gray-400'>→</span>
                                <span className='text-green-600 font-medium'>
                                  {change.newValue}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className='text-center py-4 text-gray-500'>編集履歴はありません</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className='flex justify-end space-x-2 pt-4'>
          <Button onClick={onClose} variant='outline'>
            <X className='w-4 h-4 mr-2' />
            キャンセル
          </Button>
          <Button onClick={handleSave} className='bg-blue-600 hover:bg-blue-700'>
            <Save className='w-4 h-4 mr-2' />
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
