'use client';

import { Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';

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
import { useMock } from '@/contexts/mock-context';
import type { User } from '@/schemas';

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

export default function EditDialog({ isOpen, onClose, userId }: EditDialogProps) {
  const { users, setUsers } = useMock();
  const [formData, setFormData] = useState<User | null>(null);

  const user = users.find((u) => u.id === userId);

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  if (!user || !formData) {
    return null;
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => {
      if (!prev) return prev;

      const newData = { ...prev };
      const keys = field.split('.');

      if (keys.length === 1) {
        (newData as Record<string, unknown>)[keys[0]] = value;
      } else if (keys.length === 2) {
        const parent = (newData as Record<string, unknown>)[keys[0]] as Record<string, unknown>;
        (newData as Record<string, unknown>)[keys[0]] = {
          ...parent,
          [keys[1]]: value,
        };
      } else if (keys.length === 3) {
        const parent = (newData as Record<string, unknown>)[keys[0]] as Record<string, unknown>;
        const child = parent[keys[1]] as Record<string, unknown>;
        (newData as Record<string, unknown>)[keys[0]] = {
          ...parent,
          [keys[1]]: {
            ...child,
            [keys[2]]: value,
          },
        };
      }

      return newData;
    });
  };

  const handleSave = () => {
    if (!formData) return;

    setUsers((prev) => prev.map((u) => (u.id === formData.id ? formData : u)));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto bg-orange-100 rounded-md custom-scrollbar'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-gray-900'>ユーザー編集</DialogTitle>
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
                  <Label htmlFor='family_name'>姓</Label>
                  <Input
                    id='family_name'
                    value={formData.family_name}
                    onChange={(e) => handleInputChange('family_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor='first_name'>名</Label>
                  <Input
                    id='first_name'
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor='employee_name'>従業員ID</Label>
                  <Input
                    id='employee_name'
                    value={formData.employee_type.name}
                    onChange={(e) => handleInputChange('employee.name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor='company_name'>所属会社</Label>
                  <Input
                    id='company_name'
                    value={formData.company.name}
                    onChange={(e) => handleInputChange('company.name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor='role'>ロール</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange('role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='system-admin'>システム管理者</SelectItem>
                      <SelectItem value='admin'>管理者</SelectItem>
                      <SelectItem value='member'>従業員</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor='work_type'>雇用形態</Label>
                  <Input
                    id='work_type'
                    value={formData.work_type.name}
                    onChange={(e) => handleInputChange('work_type.name', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 連絡先情報 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>連絡先情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <Label htmlFor='email'>メールアドレス</Label>
                  <Input
                    id='email'
                    type='email'
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className='w-64'
                  />
                </div>
                <div className='flex justify-between items-center'>
                  <Label htmlFor='phone'>電話番号</Label>
                  <Input
                    id='phone'
                    value=''
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className='w-64'
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 給与情報 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>給与情報</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* 1) 支給設定 */}
              <div>
                <h4 className='text-md font-semibold text-gray-800 mb-3'>支給設定</h4>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='base_salary'>基本給</Label>
                    <Input
                      id='base_salary'
                      type='number'
                      value={formData.fixed_values?.base_salary || 0}
                      onChange={(e) =>
                        handleInputChange('fixed_values.base_salary', Number(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='payment_type'>支給形態</Label>
                    <Select
                      value={formData.fixed_values?.payment_type || 'monthly'}
                      onValueChange={(value) =>
                        handleInputChange('fixed_values.payment_type', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='monthly'>月給</SelectItem>
                        <SelectItem value='hourly'>時給</SelectItem>
                        <SelectItem value='daily'>日給</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor='standard_working_hours'>所定労働時間</Label>
                    <Input
                      id='standard_working_hours'
                      type='number'
                      value={formData.fixed_values?.standard_working_hours || 0}
                      onChange={(e) =>
                        handleInputChange(
                          'fixed_values.standard_working_hours',
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='overtime_rate'>残業単価</Label>
                    <Input
                      id='overtime_rate'
                      type='number'
                      value={formData.fixed_values?.overtime_rate || 0}
                      onChange={(e) =>
                        handleInputChange('fixed_values.overtime_rate', Number(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='overtime_multiplier'>割増率</Label>
                    <Input
                      id='overtime_multiplier'
                      type='number'
                      step='0.01'
                      value={formData.fixed_values?.overtime_multiplier || 0}
                      onChange={(e) =>
                        handleInputChange(
                          'fixed_values.overtime_multiplier',
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='commuting_allowance'>通勤手当</Label>
                    <Input
                      id='commuting_allowance'
                      type='number'
                      value={formData.fixed_values?.commuting_allowance?.amount || 0}
                      onChange={(e) =>
                        handleInputChange(
                          'fixed_values.commuting_allowance.amount',
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='housing_allowance'>住宅手当</Label>
                    <Input
                      id='housing_allowance'
                      type='number'
                      value={formData.fixed_values?.housing_allowance?.amount || 0}
                      onChange={(e) =>
                        handleInputChange(
                          'fixed_values.housing_allowance.amount',
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* 2) 控除設定 */}
              <div>
                <h4 className='text-md font-semibold text-gray-800 mb-3'>控除設定</h4>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='health_insurance_rate'>健康保険料率</Label>
                    <Input
                      id='health_insurance_rate'
                      type='number'
                      step='0.001'
                      value={formData.fixed_values?.social_insurance?.health_insurance_rate || 0}
                      onChange={(e) =>
                        handleInputChange(
                          'fixed_values.social_insurance.health_insurance_rate',
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='employee_pension_rate'>厚生年金料率</Label>
                    <Input
                      id='employee_pension_rate'
                      type='number'
                      step='0.001'
                      value={formData.fixed_values?.social_insurance?.employee_pension_rate || 0}
                      onChange={(e) =>
                        handleInputChange(
                          'fixed_values.social_insurance.employee_pension_rate',
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='employment_insurance_rate'>雇用保険料率</Label>
                    <Input
                      id='employment_insurance_rate'
                      type='number'
                      step='0.001'
                      value={
                        formData.fixed_values?.social_insurance?.employment_insurance_rate || 0
                      }
                      onChange={(e) =>
                        handleInputChange(
                          'fixed_values.social_insurance.employment_insurance_rate',
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='health_insurance_type'>健康保険種別</Label>
                    <Input
                      id='health_insurance_type'
                      value={formData.fixed_values?.social_insurance?.health_insurance_type || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'fixed_values.social_insurance.health_insurance_type',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='income_tax_category'>源泉所得税区分</Label>
                    <Select
                      value={formData.fixed_values?.income_tax_category || '甲'}
                      onValueChange={(value) =>
                        handleInputChange('fixed_values.income_tax_category', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='甲'>甲</SelectItem>
                        <SelectItem value='乙'>乙</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor='dependents_count'>扶養人数</Label>
                    <Input
                      id='dependents_count'
                      type='number'
                      value={formData.fixed_values?.dependents_count || 0}
                      onChange={(e) =>
                        handleInputChange('fixed_values.dependents_count', Number(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='resident_tax_collection'>住民税徴収方法</Label>
                    <Select
                      value={formData.fixed_values?.resident_tax_collection || 'special_collection'}
                      onValueChange={(value) =>
                        handleInputChange('fixed_values.resident_tax_collection', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='special_collection'>特別徴収</SelectItem>
                        <SelectItem value='ordinary_collection'>普通徴収</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor='resident_tax_monthly_amount'>住民税月額</Label>
                    <Input
                      id='resident_tax_monthly_amount'
                      type='number'
                      value={formData.fixed_values?.resident_tax_monthly_amount || 0}
                      onChange={(e) =>
                        handleInputChange(
                          'fixed_values.resident_tax_monthly_amount',
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* 3) 計算ルール */}
              <div>
                <h4 className='text-md font-semibold text-gray-800 mb-3'>計算ルール</h4>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='amount_rounding'>金額端数処理</Label>
                    <Select
                      value={formData.fixed_values?.amount_rounding || 'round'}
                      onValueChange={(value) =>
                        handleInputChange('fixed_values.amount_rounding', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='round'>四捨五入</SelectItem>
                        <SelectItem value='floor'>切捨</SelectItem>
                        <SelectItem value='ceil'>切上</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor='time_rounding'>時間端数処理</Label>
                    <Select
                      value={formData.fixed_values?.time_rounding || 'floor'}
                      onValueChange={(value) =>
                        handleInputChange('fixed_values.time_rounding', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='round'>四捨五入</SelectItem>
                        <SelectItem value='floor'>切捨</SelectItem>
                        <SelectItem value='ceil'>切上</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor='night_shift_multiplier'>深夜割増率</Label>
                    <Input
                      id='night_shift_multiplier'
                      type='number'
                      step='0.01'
                      value={formData.fixed_values?.night_shift_multiplier || 0}
                      onChange={(e) =>
                        handleInputChange(
                          'fixed_values.night_shift_multiplier',
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='holiday_multiplier'>休日割増率</Label>
                    <Input
                      id='holiday_multiplier'
                      type='number'
                      step='0.01'
                      value={formData.fixed_values?.holiday_multiplier || 0}
                      onChange={(e) =>
                        handleInputChange('fixed_values.holiday_multiplier', Number(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* 4) 支払設定 */}
              <div>
                <h4 className='text-md font-semibold text-gray-800 mb-3'>支払設定</h4>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='bank_name'>金融機関</Label>
                    <Input
                      id='bank_name'
                      value={formData.fixed_values?.bank_account?.bank_name || ''}
                      onChange={(e) =>
                        handleInputChange('fixed_values.bank_account.bank_name', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='branch_name'>支店</Label>
                    <Input
                      id='branch_name'
                      value={formData.fixed_values?.bank_account?.branch_name || ''}
                      onChange={(e) =>
                        handleInputChange('fixed_values.bank_account.branch_name', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='account_type'>口座種別</Label>
                    <Input
                      id='account_type'
                      value={formData.fixed_values?.bank_account?.account_type || ''}
                      onChange={(e) =>
                        handleInputChange('fixed_values.bank_account.account_type', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='account_number_masked'>口座番号</Label>
                    <Input
                      id='account_number_masked'
                      value={formData.fixed_values?.bank_account?.account_number_masked || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'fixed_values.bank_account.account_number_masked',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='payment_method'>支払方法</Label>
                    <Select
                      value={formData.fixed_values?.payment_method || 'full_transfer'}
                      onValueChange={(value) =>
                        handleInputChange('fixed_values.payment_method', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='full_transfer'>全額振込</SelectItem>
                        <SelectItem value='partial_cash'>一部現金</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 勤務情報 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>勤務情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-6'>
                <div className='space-y-3'>
                  <div>
                    <Label htmlFor='work_type_name'>雇用形態</Label>
                    <Input
                      id='work_type_name'
                      value={formData.work_type.name}
                      onChange={(e) => handleInputChange('work_type.name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor='group_name'>所属グループ</Label>
                    <Input
                      id='group_name'
                      value={formData.primary_group?.name || ''}
                      onChange={(e) => handleInputChange('primary_group.name', e.target.value)}
                    />
                  </div>
                </div>
                <div className='space-y-3'>
                  <div>
                    <Label htmlFor='user_role'>ロール</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleInputChange('role', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='system-admin'>システム管理者</SelectItem>
                        <SelectItem value='admin'>管理者</SelectItem>
                        <SelectItem value='member'>従業員</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* システム情報 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>システム情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>ユーザーID</Label>
                  <p className='text-lg font-semibold'>{formData.id}</p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>従業員ID</Label>
                  <p className='text-lg font-semibold'>{formData.employee_type.name}</p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>登録日時</Label>
                  <p className='text-lg'>-</p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>最終更新日時</Label>
                  <p className='text-lg'>-</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 権限情報 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>権限情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <Label htmlFor='is_admin'>管理者権限</Label>
                  <span className='font-semibold'>
                    {formData.role === 'admin' || formData.role === 'system-admin'
                      ? 'あり'
                      : 'なし'}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>アクティブ</span>
                  <span className='font-semibold'>はい</span>
                </div>
              </div>
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
