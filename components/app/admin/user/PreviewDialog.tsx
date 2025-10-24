'use client';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMock } from '@/contexts/mock-context';
import { getUserFullName } from '@/lib/utils/user';

interface PreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

export default function PreviewDialog({ isOpen, onClose, userId }: PreviewDialogProps) {
  const { users } = useMock();

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return null;
  }

  const getStatusColor = (role: string) => {
    switch (role) {
      case 'system-admin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'member':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto bg-orange-100 rounded-md custom-scrollbar'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-gray-900'>ユーザー詳細</DialogTitle>
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
                  <p className='text-sm font-medium text-gray-600'>従業員名</p>
                  <p className='text-lg font-semibold'>
                    {getUserFullName(user.family_name, user.first_name)}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>従業員ID</p>
                  <p className='text-lg'>{user.employee_type.name}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>所属会社</p>
                  <p className='text-lg'>{user.company.name}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>雇用形態</p>
                  <p className='text-lg'>{user.work_type.name}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-gray-600'>ロール</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      user.role
                    )}`}
                  >
                    {user.role === 'system-admin'
                      ? 'システム管理者'
                      : user.role === 'admin'
                        ? '管理者'
                        : '従業員'}
                  </span>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>所属グループ</p>
                  <p className='text-lg'>{user.primary_group?.name || '未設定'}</p>
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
                  <span className='text-gray-600'>メールアドレス</span>
                  <span className='font-semibold'>{user.email}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>電話番号</span>
                  <span className='font-semibold'>未設定</span>
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
                    <p className='text-sm font-medium text-gray-600'>基本給</p>
                    <p className='text-lg font-semibold'>
                      ¥{user.fixed_values.base_salary?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>支給形態</p>
                    <p className='text-lg'>
                      {user.fixed_values.payment_type === 'monthly'
                        ? '月給'
                        : user.fixed_values.payment_type === 'hourly'
                          ? '時給'
                          : '日給'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>所定労働時間</p>
                    <p className='text-lg'>
                      {user.fixed_values.standard_working_hours || 0}時間/月
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>残業単価</p>
                    <p className='text-lg'>
                      ¥{user.fixed_values.overtime_rate?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>割増率</p>
                    <p className='text-lg'>{user.fixed_values.overtime_multiplier || 0}倍</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>固定残業</p>
                    <p className='text-lg'>
                      {user.fixed_values.fixed_overtime?.is_enabled ? 'あり' : 'なし'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>通勤手当</p>
                    <p className='text-lg'>
                      ¥{user.fixed_values.commuting_allowance?.amount?.toLocaleString() || '0'}
                      <span className='text-sm text-gray-500 ml-1'>
                        (
                        {user.fixed_values.commuting_allowance?.tax_category === 'taxable'
                          ? '課税'
                          : '非課税'}
                        )
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>住宅手当</p>
                    <p className='text-lg'>
                      ¥{user.fixed_values.housing_allowance?.amount?.toLocaleString() || '0'}
                      <span className='text-sm text-gray-500 ml-1'>
                        (
                        {user.fixed_values.housing_allowance?.tax_category === 'taxable'
                          ? '課税'
                          : '非課税'}
                        )
                      </span>
                    </p>
                  </div>
                  {user.fixed_values.custom_allowances &&
                    user.fixed_values.custom_allowances.length > 0 && (
                      <div className='col-span-2'>
                        <p className='text-sm font-medium text-gray-600'>その他手当</p>
                        <div className='space-y-1'>
                          {user.fixed_values.custom_allowances.map((allowance, index) => (
                            <p key={index} className='text-lg'>
                              {allowance.name}: ¥{allowance.amount?.toLocaleString() || '0'}
                              <span className='text-sm text-gray-500 ml-1'>
                                ({allowance.tax_category === 'taxable' ? '課税' : '非課税'})
                              </span>
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* 2) 控除設定 */}
              <div>
                <h4 className='text-md font-semibold text-gray-800 mb-3'>控除設定</h4>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>健康保険料率</p>
                    <p className='text-lg'>
                      {(
                        (user.fixed_values.social_insurance?.health_insurance_rate || 0) * 100
                      ).toFixed(2)}
                      %
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>厚生年金料率</p>
                    <p className='text-lg'>
                      {(
                        (user.fixed_values.social_insurance?.employee_pension_rate || 0) * 100
                      ).toFixed(2)}
                      %
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>雇用保険料率</p>
                    <p className='text-lg'>
                      {(
                        (user.fixed_values.social_insurance?.employment_insurance_rate || 0) * 100
                      ).toFixed(2)}
                      %
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>健康保険種別</p>
                    <p className='text-lg'>
                      {user.fixed_values.social_insurance?.health_insurance_type || '-'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>源泉所得税区分</p>
                    <p className='text-lg'>{user.fixed_values.income_tax_category || '-'}</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>扶養人数</p>
                    <p className='text-lg'>{user.fixed_values.dependents_count || 0}人</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>住民税徴収方法</p>
                    <p className='text-lg'>
                      {user.fixed_values.resident_tax_collection === 'special_collection'
                        ? '特別徴収'
                        : user.fixed_values.resident_tax_collection === 'ordinary_collection'
                          ? '普通徴収'
                          : '-'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>住民税月額</p>
                    <p className='text-lg'>
                      ¥{user.fixed_values.resident_tax_monthly_amount?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3) 計算ルール */}
              <div>
                <h4 className='text-md font-semibold text-gray-800 mb-3'>計算ルール</h4>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>金額端数処理</p>
                    <p className='text-lg'>
                      {user.fixed_values.amount_rounding === 'round'
                        ? '四捨五入'
                        : user.fixed_values.amount_rounding === 'floor'
                          ? '切捨'
                          : '切上'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>時間端数処理</p>
                    <p className='text-lg'>
                      {user.fixed_values.time_rounding === 'round'
                        ? '四捨五入'
                        : user.fixed_values.time_rounding === 'floor'
                          ? '切捨'
                          : '切上'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>深夜割増率</p>
                    <p className='text-lg'>{user.fixed_values.night_shift_multiplier || 0}倍</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>休日割増率</p>
                    <p className='text-lg'>{user.fixed_values.holiday_multiplier || 0}倍</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>最低賃金チェック</p>
                    <p className='text-lg'>
                      {user.fixed_values.minimum_wage_check ? '有効' : '無効'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4) 支払設定 */}
              <div>
                <h4 className='text-md font-semibold text-gray-800 mb-3'>支払設定</h4>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>金融機関</p>
                    <p className='text-lg'>{user.fixed_values.bank_account?.bank_name || '-'}</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>支店</p>
                    <p className='text-lg'>{user.fixed_values.bank_account?.branch_name || '-'}</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>口座種別</p>
                    <p className='text-lg'>{user.fixed_values.bank_account?.account_type || '-'}</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>口座番号</p>
                    <p className='text-lg'>
                      {user.fixed_values.bank_account?.account_number_masked || '-'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>支払方法</p>
                    <p className='text-lg'>
                      {user.fixed_values.payment_method === 'full_transfer'
                        ? '全額振込'
                        : user.fixed_values.payment_method === 'partial_cash'
                          ? '一部現金'
                          : '-'}
                    </p>
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
                  <p className='text-sm font-medium text-gray-600'>ユーザーID</p>
                  <p className='text-lg font-semibold'>{user.id}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>従業員ID</p>
                  <p className='text-lg font-semibold'>{user.employee_type.name}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>登録日時</p>
                  <p className='text-lg'>-</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>最終更新日時</p>
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
                  <span className='text-gray-600'>管理者権限</span>
                  <span className='font-semibold'>
                    {user.role === 'admin' || user.role === 'system-admin' ? 'あり' : 'なし'}
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

        <div className='flex justify-end pt-4'>
          <Button onClick={onClose} variant='outline'>
            <X className='w-4 h-4 mr-2' />
            閉じる
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
