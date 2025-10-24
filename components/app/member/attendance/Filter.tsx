'use client';

import BaseFilter from '@/components/common/Filter';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMock } from '@/contexts/mock-context';

interface AttendanceFilters {
  status: string[];
  user: string[];
  group: string[];
  workType: string[];
  search: string;
  dateRange: {
    from: string;
    to: string;
  };
}

interface FilterProps {
  filters: AttendanceFilters;
  onFiltersChange: (filters: AttendanceFilters) => void;
}

export default function Filter({ filters, onFiltersChange }: FilterProps) {
  const { users } = useMock();

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatus = checked
      ? [...filters.status, status]
      : filters.status.filter((s) => s !== status);
    onFiltersChange({ ...filters, status: newStatus });
  };

  const handleDateRangeChange = (field: 'from' | 'to', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value,
      },
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: [],
      user: [],
      group: [],
      workType: [],
      search: '',
      dateRange: {
        from: '',
        to: '',
      },
    });
  };

  const activeFiltersCount =
    filters.status.length +
    filters.user.length +
    filters.group.length +
    filters.workType.length +
    (filters.search ? 1 : 0) +
    (filters.dateRange.from ? 1 : 0) +
    (filters.dateRange.to ? 1 : 0);

  return (
    <BaseFilter activeFiltersCount={activeFiltersCount} onClearFilters={clearFilters}>
      {/* ステータスフィルター */}
      <div>
        <Label className='text-sm font-medium text-gray-700'>ステータス</Label>
        <div className='grid grid-cols-2 gap-2 mt-1'>
          {[
            { value: 'normal', label: '正常' },
            { value: 'late', label: '遅刻' },
            { value: 'early_leave', label: '早退' },
            { value: 'absent', label: '欠勤' },
          ].map((status) => (
            <div key={status.value} className='flex items-center space-x-2'>
              <Checkbox
                id={`status-${status.value}`}
                checked={filters.status.includes(status.value)}
                onCheckedChange={(checked) => handleStatusChange(status.value, checked as boolean)}
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

      {/* 日付範囲フィルター */}
      <div>
        <Label className='text-sm font-medium text-gray-700'>日付範囲</Label>
        <div className='grid grid-cols-2 gap-2'>
          <div>
            <Label htmlFor='date-from' className='text-xs text-gray-500'>
              開始日
            </Label>
            <Input
              id='date-from'
              type='date'
              value={filters.dateRange.from}
              onChange={(e) => handleDateRangeChange('from', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor='date-to' className='text-xs text-gray-500'>
              終了日
            </Label>
            <Input
              id='date-to'
              type='date'
              value={filters.dateRange.to}
              onChange={(e) => handleDateRangeChange('to', e.target.value)}
            />
          </div>
        </div>
      </div>
    </BaseFilter>
  );
}
