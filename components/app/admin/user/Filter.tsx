'use client';

import BaseFilter from '@/components/common/Filter';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface UserFilters {
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  status: string[];
  workTypeId: string | null;
  groupId: string | null;
  userId: string | null;
  searchTerm: string;
}

interface UserFilterProps {
  filters: UserFilters;
  onFiltersChangeAction: (filters: UserFilters) => void;
  users: {
    id: string;
    family_name: string;
    first_name: string;
    employee_name: string;
  }[];
  groups: { id: string; name: string }[];
  workTypes: { id: string; name: string }[];
  isLoading?: boolean;
  onResetFilters?: () => void;
}

export default function UserFilter({
  filters,
  onFiltersChangeAction,
  users,
  groups,
  workTypes,
  onResetFilters,
}: UserFilterProps) {
  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatuses = checked
      ? [...filters.status, status]
      : filters.status.filter((s) => s !== status);
    onFiltersChangeAction({
      ...filters,
      status: newStatuses,
    });
  };

  const handleWorkTypeChange = (value: string) => {
    const workTypeId = value === 'all' ? null : value;
    onFiltersChangeAction({
      ...filters,
      workTypeId,
    });
  };

  const handleUserChange = (value: string) => {
    const userId = value === 'all' ? null : value;
    onFiltersChangeAction({
      ...filters,
      userId,
    });
  };

  const handleGroupChange = (value: string) => {
    const groupId = value === 'all' ? null : value;
    onFiltersChangeAction({
      ...filters,
      groupId,
    });
  };

  const handleSearchChange = (value: string) => {
    onFiltersChangeAction({
      ...filters,
      searchTerm: value,
    });
  };

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    onFiltersChangeAction({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value || null,
      },
    });
  };

  const clearFilters = () => {
    if (onResetFilters) {
      onResetFilters();
    } else {
      onFiltersChangeAction({
        dateRange: { startDate: null, endDate: null },
        status: [],
        workTypeId: null,
        groupId: null,
        userId: null,
        searchTerm: '',
      });
    }
  };

  // アクティブなフィルター数を計算
  const activeFiltersCount =
    (filters.dateRange.startDate ? 1 : 0) +
    (filters.dateRange.endDate ? 1 : 0) +
    filters.status.length +
    (filters.workTypeId ? 1 : 0) +
    (filters.groupId ? 1 : 0) +
    (filters.searchTerm ? 1 : 0);

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
          placeholder='名前または従業員名で検索'
          value={filters.searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className='mt-1'
        />
      </div>

      {/* 従業員フィルター */}
      <div>
        <Label htmlFor='user-filter' className='text-sm font-medium text-gray-700'>
          従業員
        </Label>
        <Combobox
          options={[
            { value: 'all', label: '全従業員' },
            ...Array.from(new Map(users.map((user) => [user.id, user])).values()).map((user) => ({
              value: user.id,
              label: user.employee_name,
              code: `${user.family_name} ${user.first_name}`,
            })),
          ]}
          value={filters.userId || 'all'}
          onValueChange={handleUserChange}
          placeholder='従業員を選択'
          emptyText='該当する従業員がありません'
          className='mt-1'
        />
      </div>

      {/* グループフィルター */}
      <div>
        <Label htmlFor='group-filter' className='text-sm font-medium text-gray-700'>
          グループ
        </Label>
        <Combobox
          options={[
            { value: 'all', label: '全グループ' },
            ...Array.from(new Map(groups.map((group) => [group.name, group])).values()).map(
              (group) => ({
                value: group.id,
                label: group.name,
              })
            ),
          ]}
          value={filters.groupId || 'all'}
          onValueChange={handleGroupChange}
          placeholder='グループを選択'
          emptyText='該当するグループがありません'
          className='mt-1'
        />
      </div>

      {/* ロールフィルター */}
      <div>
        <Label className='text-sm font-medium text-gray-700'>ロール</Label>
        <div className='grid grid-cols-2 gap-2 mt-1'>
          {[
            { value: 'system-admin', label: 'システム管理者' },
            { value: 'admin', label: '管理者' },
            { value: 'member', label: '従業員' },
          ].map((role) => (
            <div key={role.value} className='flex items-center space-x-2'>
              <Checkbox
                id={`role-${role.value}`}
                checked={filters.status.includes(role.value)}
                onCheckedChange={(checked) => handleStatusChange(role.value, checked as boolean)}
              />
              <Label htmlFor={`role-${role.value}`} className='text-sm font-normal cursor-pointer'>
                {role.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* 勤務形態フィルター */}
      <div>
        <Label htmlFor='work-type-filter' className='text-sm font-medium text-gray-700'>
          勤務形態
        </Label>
        <Select value={filters.workTypeId || 'all'} onValueChange={handleWorkTypeChange}>
          <SelectTrigger className='mt-1'>
            <SelectValue placeholder='すべて' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>すべて</SelectItem>
            {Array.from(
              new Map(workTypes.map((workType) => [workType.name, workType])).values()
            ).map((workType) => (
              <SelectItem key={workType.id} value={workType.name}>
                {workType.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 日付範囲フィルター */}
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <Label htmlFor='start-date' className='text-sm font-medium text-gray-700'>
            登録開始日
          </Label>
          <Input
            id='start-date'
            type='date'
            value={filters.dateRange.startDate || ''}
            onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
            className='mt-1'
          />
        </div>
        <div>
          <Label htmlFor='end-date' className='text-sm font-medium text-gray-700'>
            登録終了日
          </Label>
          <Input
            id='end-date'
            type='date'
            value={filters.dateRange.endDate || ''}
            onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
            className='mt-1'
          />
        </div>
      </div>
    </BaseFilter>
  );
}
