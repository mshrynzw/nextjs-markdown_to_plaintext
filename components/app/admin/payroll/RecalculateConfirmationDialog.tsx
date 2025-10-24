'use client';
import { Calculator, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils/payroll';

interface RecalculateResult {
  payrollId: string;
  employeeName: string;
  beforeAmount: number;
  afterAmount: number;
  difference: number;
  paymentItemsDiff?: {
    baseSalary: { before: number; after: number; difference: number };
    overtimeAllowance: { before: number; after: number; difference: number };
    commutingAllowance: { before: number; after: number; difference: number };
    housingAllowance: { before: number; after: number; difference: number };
    totalPayment: { before: number; after: number; difference: number };
  };
  deductionItemsDiff?: {
    healthInsurance: { before: number; after: number; difference: number };
    employeePension: { before: number; after: number; difference: number };
    employmentInsurance: { before: number; after: number; difference: number };
    incomeTax: { before: number; after: number; difference: number };
    residentTax: { before: number; after: number; difference: number };
    totalDeduction: { before: number; after: number; difference: number };
  };
}

interface RecalculateConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onCancel: () => void;
  results: RecalculateResult[];
}

export default function RecalculateConfirmationDialog({
  isOpen,
  onClose,
  onApply,
  onCancel,
  results,
}: RecalculateConfirmationDialogProps) {
  const totalDifference = results.reduce((sum, result) => sum + result.difference, 0);

  const renderDetailRow = (label: string, before: number, after: number, difference: number) => {
    const hasChange = difference !== 0;
    return (
      <div className='flex justify-between items-center py-1'>
        <span className='text-sm text-gray-600'>{label}</span>
        <div className='flex items-center space-x-2'>
          {hasChange && (
            <span className='text-sm text-gray-500 line-through'>{formatCurrency(before)}</span>
          )}
          <span className={`text-sm font-medium ${hasChange ? 'text-green-600' : 'text-gray-900'}`}>
            {formatCurrency(after)}
          </span>
          {hasChange && (
            <span
              className={`text-xs px-2 py-1 rounded ${
                difference > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {difference > 0 ? '+' : ''}
              {formatCurrency(difference)}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center space-x-2'>
            <Calculator className='w-5 h-5 text-yellow-600' />
            <span>再計算結果の確認</span>
          </DialogTitle>
          <DialogDescription>
            以下の給与データが再計算されました。計算前後の差分を確認して、適用するかキャンセルしてください。
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* サマリー */}
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-semibold text-yellow-800'>再計算サマリー</h3>
                <p className='text-sm text-yellow-700'>
                  {results.length}件の給与データが再計算されました
                </p>
              </div>
              <div className='text-right'>
                <p className='text-sm text-yellow-700'>合計差分</p>
                <p
                  className={`text-2xl font-bold ${
                    totalDifference >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {totalDifference >= 0 ? '+' : ''}
                  {formatCurrency(totalDifference)}
                </p>
              </div>
            </div>
          </div>

          {/* 詳細テーブル */}
          <div className='space-y-4'>
            {results.map((result) => (
              <div key={result.payrollId} className='border rounded-lg p-4 bg-gray-50'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='text-lg font-semibold text-gray-800'>{result.employeeName}</h3>
                  <div className='text-right'>
                    <div className='text-sm text-gray-600'>差引支給額</div>
                    <div className='flex items-center space-x-2'>
                      <span className='text-sm text-gray-500 line-through'>
                        {formatCurrency(result.beforeAmount)}
                      </span>
                      <span className='text-lg font-bold text-green-600'>
                        {formatCurrency(result.afterAmount)}
                      </span>
                      <span
                        className={`text-sm px-2 py-1 rounded font-semibold ${
                          result.difference >= 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {result.difference >= 0 ? '+' : ''}
                        {formatCurrency(result.difference)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* 支給項目 */}
                  {result.paymentItemsDiff && (
                    <div>
                      <h4 className='text-sm font-semibold text-gray-700 mb-3 border-b pb-1'>
                        支給項目
                      </h4>
                      <div className='space-y-1'>
                        {renderDetailRow(
                          '基本給',
                          result.paymentItemsDiff.baseSalary.before,
                          result.paymentItemsDiff.baseSalary.after,
                          result.paymentItemsDiff.baseSalary.difference
                        )}
                        {renderDetailRow(
                          '残業手当',
                          result.paymentItemsDiff.overtimeAllowance.before,
                          result.paymentItemsDiff.overtimeAllowance.after,
                          result.paymentItemsDiff.overtimeAllowance.difference
                        )}
                        {renderDetailRow(
                          '通勤手当',
                          result.paymentItemsDiff.commutingAllowance.before,
                          result.paymentItemsDiff.commutingAllowance.after,
                          result.paymentItemsDiff.commutingAllowance.difference
                        )}
                        {renderDetailRow(
                          '住宅手当',
                          result.paymentItemsDiff.housingAllowance.before,
                          result.paymentItemsDiff.housingAllowance.after,
                          result.paymentItemsDiff.housingAllowance.difference
                        )}
                        <div className='border-t pt-1 mt-2'>
                          {renderDetailRow(
                            '総支給額',
                            result.paymentItemsDiff.totalPayment.before,
                            result.paymentItemsDiff.totalPayment.after,
                            result.paymentItemsDiff.totalPayment.difference
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 控除項目 */}
                  {result.deductionItemsDiff && (
                    <div>
                      <h4 className='text-sm font-semibold text-gray-700 mb-3 border-b pb-1'>
                        控除項目
                      </h4>
                      <div className='space-y-1'>
                        {renderDetailRow(
                          '健康保険',
                          result.deductionItemsDiff.healthInsurance.before,
                          result.deductionItemsDiff.healthInsurance.after,
                          result.deductionItemsDiff.healthInsurance.difference
                        )}
                        {renderDetailRow(
                          '厚生年金',
                          result.deductionItemsDiff.employeePension.before,
                          result.deductionItemsDiff.employeePension.after,
                          result.deductionItemsDiff.employeePension.difference
                        )}
                        {renderDetailRow(
                          '雇用保険',
                          result.deductionItemsDiff.employmentInsurance.before,
                          result.deductionItemsDiff.employmentInsurance.after,
                          result.deductionItemsDiff.employmentInsurance.difference
                        )}
                        {renderDetailRow(
                          '所得税',
                          result.deductionItemsDiff.incomeTax.before,
                          result.deductionItemsDiff.incomeTax.after,
                          result.deductionItemsDiff.incomeTax.difference
                        )}
                        {renderDetailRow(
                          '住民税',
                          result.deductionItemsDiff.residentTax.before,
                          result.deductionItemsDiff.residentTax.after,
                          result.deductionItemsDiff.residentTax.difference
                        )}
                        <div className='border-t pt-1 mt-2'>
                          {renderDetailRow(
                            '総控除額',
                            result.deductionItemsDiff.totalDeduction.before,
                            result.deductionItemsDiff.totalDeduction.after,
                            result.deductionItemsDiff.totalDeduction.difference
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className='flex justify-between'>
          <Button variant='outline' onClick={onCancel} className='flex items-center space-x-2'>
            <X className='w-4 h-4' />
            <span>キャンセル</span>
          </Button>
          <Button onClick={onApply} className='bg-yellow-600 hover:bg-yellow-700 text-white'>
            <Calculator className='w-4 h-4 mr-2' />
            再計算の結果を適用する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
