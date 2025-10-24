'use client';

import { Filter } from 'lucide-react';

import BaseFilter from '@/components/common/Filter';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PayrollFilters {
  selectedMonth: string | null;
  status: string[];
}

interface PayrollFilterProps {
  filters: PayrollFilters;
  onFiltersChange: (filters: PayrollFilters) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onResetFilters?: () => void;
}

export default function PayrollFilter({
  filters,
  onFiltersChange,
  selectedMonth,
  onMonthChange,
  onResetFilters,
}: PayrollFilterProps) {
  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatuses = checked
      ? [...filters.status, status]
      : filters.status.filter((s) => s !== status);
    onFiltersChange({
      ...filters,
      status: newStatuses,
    });
  };

  const clearFilters = () => {
    if (onResetFilters) {
      onResetFilters();
    } else {
      const currentMonth = new Date().toISOString().slice(0, 7);
      onMonthChange(currentMonth);
      onFiltersChange({
        selectedMonth: currentMonth,
        status: [],
      });
    }
  };

  // アクティブなフィルター数を計算
  const activeFiltersCount = (filters.selectedMonth ? 1 : 0) + filters.status.length;

  return (
    <>
      {/* 月選択フィルター */}
      <div>
        <Label htmlFor='month-selector' className='text-sm font-medium text-gray-700'>
          月選択
        </Label>
        <div className='flex items-center space-x-2 mt-1'>
          <Filter className='w-4 h-4 text-gray-500' />
          <Input
            id='month-selector'
            type='month'
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className='w-40'
          />
        </div>
      </div>
      <BaseFilter activeFiltersCount={activeFiltersCount} onClearFilters={clearFilters}>
        {/* ステータスフィルター */}
        <div>
          <Label className='text-sm font-medium text-gray-700'>ステータス</Label>
          <div className='grid grid-cols-2 gap-2 mt-1'>
            {[
              { value: '未処理', label: '未処理' },
              { value: '承認待ち', label: '承認待ち' },
              { value: '承認済み', label: '承認済み' },
              { value: '支払完了', label: '支払完了' },
            ].map((status) => (
              <div key={status.value} className='flex items-center space-x-2'>
                <Checkbox
                  id={`status-${status.value}`}
                  checked={filters.status.includes(status.value)}
                  onCheckedChange={(checked) =>
                    handleStatusChange(status.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`status-${status.value}`}
                  className='text-sm font-normal cursor-pointer'
                >
                  {status.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </BaseFilter>
    </>
  );
}
