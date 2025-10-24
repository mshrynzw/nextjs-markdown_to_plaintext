import { Calculator, Loader2, Settings, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface HeaderButtonProps {
  setIsColumnSettingsDialogOpen: (open: boolean) => void;
  onRecalculateClick: () => void;
  isRecalculateMode: boolean;
  setIsRecalculateMode: (isRecalculateMode: boolean) => void;
  isRecalculating: boolean;
}

export default function HeaderButton({
  setIsColumnSettingsDialogOpen,
  onRecalculateClick,
  isRecalculateMode,
  setIsRecalculateMode,
  isRecalculating,
}: HeaderButtonProps) {
  return (
    <div className='flex flex-row items-center justify-center space-x-2'>
      {isRecalculateMode ? (
        <>
          <Button
            variant='ghost'
            size='sm'
            onClick={onRecalculateClick}
            disabled={isRecalculating}
            className='bg-yellow-100 hover:bg-yellow-200 text-yellow-800 hover:text-yellow-900 h-10 px-4 py-2 shadow-md relative disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <div className='flex items-center space-x-2'>
              {isRecalculating ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span className='hidden md:block'>再計算中...</span>
                </>
              ) : (
                <>
                  <Calculator className='w-4 h-4' />
                  <span className='hidden md:block'>再計算を実行する</span>
                  <div className='relative'>
                    <div className='absolute inline-flex h-3 w-3 rounded-full bg-yellow-400 top-0.5 opacity-75 animate-ping'></div>
                    <div className='relative inline-flex h-3 w-3 rounded-full bg-yellow-500'></div>
                  </div>
                </>
              )}
            </div>
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsRecalculateMode(false)}
            disabled={isRecalculating}
            className='bg-white text-gray-800 hover:text-gray-900 h-10 px-4 py-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <X className='w-4 h-4' />
            <span className='hidden md:block'>キャンセル</span>
          </Button>
        </>
      ) : (
        <Button
          variant='default'
          size='sm'
          onClick={onRecalculateClick}
          className='bg-blue-600 hover:bg-blue-700 text-white'
        >
          <Calculator className='w-4 h-4' />
          <span className='hidden md:block'>再計算</span>
        </Button>
      )}
      <Button variant='outline' size='sm' onClick={() => setIsColumnSettingsDialogOpen(true)}>
        <Settings className='w-4 h-4' />
        <span className='hidden md:block'>表示項目</span>
      </Button>
    </div>
  );
}
