'use client';

import { Button } from '@/components/ui/button';

interface HeaderButtonProps {
  onColumnSettings: () => void;
}

export default function HeaderButton({ onColumnSettings }: HeaderButtonProps) {
  return (
    <div className='flex space-x-2'>
      <Button variant='outline' onClick={onColumnSettings}>
        表示項目
      </Button>
    </div>
  );
}
