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

  const handleUserChange = (userId: string, checked: boolean) => {
    const newUsers = checked ? [...filters.user, userId] : filters.user.filter((u) => u !== userId);
    onFiltersChange({ ...filters, user: newUsers });
  };

  const handleGroupChange = (groupId: string, checked: boolean) => {
    const newGroups = checked
      ? [...filters.group, groupId]
      : filters.group.filter((g) => g !== groupId);
    onFiltersChange({ ...filters, group: newGroups });
  };

  const handleWorkTypeChange = (workTypeId: string, checked: boolean) => {
    const newWorkTypes = checked
      ? [...filters.workType, workTypeId]
      : filters.workType.filter((w) => w !== workTypeId);
    onFiltersChange({ ...filters, workType: newWorkTypes });
  };

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
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

  const getUniqueGroups = () => {
    const groups = users
      .map((user) => user.primary_group)
      .filter((group) => group !== null && group !== undefined);
    return Array.from(new Set(groups.map((group) => group!.id))).map((id) => {
      const group = groups.find((g) => g!.id === id);
      return { id: group!.id, name: group!.name };
    });
  };

  const getUniqueWorkTypes = () => {
    const workTypes = users
      .map((user) => user.work_type)
      .filter((workType) => workType !== null && workType !== undefined);
    return Array.from(new Set(workTypes.map((workType) => workType!.id))).map((id) => {
      const workType = workTypes.find((wt) => wt!.id === id);
      return { id: workType!.id, name: workType!.name };
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
      {/* 検索フィルター */}
      <div>
        <Label htmlFor='search' className='text-sm font-medium text-gray-700'>
          検索
        </Label>
        <Input
          id='search'
          type='text'
          placeholder='従業員名、グループ、勤務形態で検索'
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className='mt-1'
        />
      </div>

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

      {/* 勤務形態フィルター */}
      <div>
        <Label className='text-sm font-medium text-gray-700'>勤務形態</Label>
        <div className='flex flex-row gap-2 mt-1'>
          {getUniqueWorkTypes().map((workType) => (
            <div key={workType.id} className='flex items-center space-x-2'>
              <Checkbox
                id={`workType-${workType.id}`}
                checked={filters.workType.includes(workType.id)}
                onCheckedChange={(checked) => handleWorkTypeChange(workType.id, checked as boolean)}
              />
              <Label
                htmlFor={`workType-${workType.id}`}
                className='text-sm font-normal cursor-pointer'
              >
                {workType.name}
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
