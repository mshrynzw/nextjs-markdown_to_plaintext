import { Settings, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface HeaderButtonProps {
  setIsColumnSettingsDialogOpen: (open: boolean) => void;
}

export default function HeaderButton({ setIsColumnSettingsDialogOpen }: HeaderButtonProps) {
  return (
    <div className='flex flex-row items-center justify-center space-x-2'>
      <Button variant='outline' size='sm' onClick={() => setIsColumnSettingsDialogOpen(true)}>
        <Settings className='w-4 h-4' />
        <span className='hidden md:block'>表示項目</span>
      </Button>
    </div>
  );
}
