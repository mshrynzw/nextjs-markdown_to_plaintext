'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TimeInputProps {
  label: string;
  hours: number;
  minutes: number;
  onHoursChange: (hours: number) => void;
  onMinutesChange: (minutes: number) => void;
  disabled?: boolean;
  className?: string;
}

export default function TimeInput({
  label,
  hours,
  minutes,
  onHoursChange,
  onMinutesChange,
  disabled = false,
  className = '',
}: TimeInputProps) {
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onHoursChange(Math.max(0, value));
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    // 分は0-59の範囲に制限
    const clampedMinutes = Math.max(0, Math.min(59, value));
    onMinutesChange(clampedMinutes);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className='text-sm font-medium'>{label}</Label>
      <div className='flex items-center gap-2 justify-center'>
        <div className='flex-1'>
          <Input
            type='number'
            min='0'
            value={hours}
            onChange={handleHoursChange}
            disabled={disabled}
            className='text-right'
            placeholder='0'
          />
        </div>
        <p className='text-xs text-gray-500 text-center mt-1'>時間</p>
        <div className='flex-1'>
          <Input
            type='number'
            min='0'
            max='59'
            value={minutes}
            onChange={handleMinutesChange}
            disabled={disabled}
            className='text-right'
            placeholder='0'
          />
        </div>
        <p className='text-xs text-gray-500 text-center mt-1'>分</p>
      </div>
    </div>
  );
}
