'use client';

import { Filter } from 'lucide-react';

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
import { getUserFullName } from '@/lib/utils/user';

export interface PayrollFilters {
  selectedMonth: string | null;
  status: string[];
  hasOvertime: boolean | null;
  workTypeId: string | null;
  employeeTypeId: string | null;
  userId: string | null;
  groupId: string | null;
  memberCheckStatus: 'checked' | 'unchecked' | 'all';
}

interface PayrollFilterProps {
  filters: PayrollFilters;
  onFiltersChangeAction: (filters: PayrollFilters) => void;
  selectedMonth: string;
  onMonthChangeAction: (month: string) => void;
  users: {
    id: string;
    family_name: string;
    first_name: string;
  }[];
  groups: { id: string; name: string }[];
  workTypes: { id: string; name: string }[];
  employeeTypes: { id: string; name: string }[];
  isLoading?: boolean;
}

export default function PayrollFilter({
  filters,
  onFiltersChangeAction,
  selectedMonth,
  onMonthChangeAction,
  users,
  groups,
  workTypes,
  employeeTypes,
}: PayrollFilterProps) {
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

  const handleEmployeeTypeChange = (value: string) => {
    const employeeTypeId = value === 'all' ? null : value;
    onFiltersChangeAction({
      ...filters,
      employeeTypeId,
    });
  };

  const handleMemberCheckStatusChange = (value: string) => {
    const memberCheckStatus = value as 'checked' | 'unchecked' | 'all';
    onFiltersChangeAction({
      ...filters,
      memberCheckStatus,
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

  const clearFilters = () => {
    onMonthChangeAction('');
    onFiltersChangeAction({
      selectedMonth: null,
      status: [],
      hasOvertime: null,
      workTypeId: null,
      employeeTypeId: null,
      userId: null,
      groupId: null,
      memberCheckStatus: 'all',
    });
  };

  // アクティブなフィルター数を計算
  const activeFiltersCount =
    (filters.selectedMonth ? 1 : 0) +
    filters.status.length +
    (filters.hasOvertime !== null ? 1 : 0) +
    (filters.workTypeId ? 1 : 0) +
    (filters.employeeTypeId ? 1 : 0) +
    (filters.userId ? 1 : 0) +
    (filters.groupId ? 1 : 0) +
    (filters.memberCheckStatus !== 'all' ? 1 : 0);

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
            onChange={(e) => onMonthChangeAction(e.target.value)}
            className='w-40'
          />
        </div>
      </div>

      <BaseFilter activeFiltersCount={activeFiltersCount} onClearFilters={clearFilters}>
        {/* 従業員フィルター */}
        <div>
          <Label htmlFor='user-filter' className='text-sm font-medium text-gray-700'>
            従業員
          </Label>
          <Combobox
            options={[
              { value: 'all', label: '全従業員' },
              ...users.map((user) => ({
                value: user.id,
                label: getUserFullName(user.family_name, user.first_name),
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
              ...groups.map((group) => ({
                value: group.id,
                label: group.name,
              })),
            ]}
            value={filters.groupId || 'all'}
            onValueChange={handleGroupChange}
            placeholder='グループを選択'
            emptyText='該当するグループがありません'
            className='mt-1'
          />
        </div>

        {/* 従業員の確認フィルター */}
        <div>
          <Label className='text-sm font-medium text-gray-700'>従業員の確認</Label>
          <Select value={filters.memberCheckStatus} onValueChange={handleMemberCheckStatusChange}>
            <SelectTrigger className='mt-1'>
              <SelectValue placeholder='確認状態を選択' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>すべて</SelectItem>
              <SelectItem value='checked'>確認済み</SelectItem>
              <SelectItem value='unchecked'>未確認</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
              {workTypes.map((workType) => (
                <SelectItem key={workType.id} value={workType.name}>
                  {workType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 雇用状態フィルター */}
        <div>
          <Label htmlFor='employee-type-filter' className='text-sm font-medium text-gray-700'>
            雇用状態
          </Label>
          <Select value={filters.employeeTypeId || 'all'} onValueChange={handleEmployeeTypeChange}>
            <SelectTrigger className='mt-1'>
              <SelectValue placeholder='承認状態を選択' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>すべて</SelectItem>
              {employeeTypes.map((employeeType) => (
                <SelectItem key={employeeType.id} value={employeeType.name}>
                  {employeeType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </BaseFilter>
    </>
  );
}
