'use client';

import { HelpCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export default function HelpDialog({ isOpen, onClose, title, description }: HelpDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-7xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-xl font-bold text-gray-900'>
            <HelpCircle className='w-6 h-6 text-blue-600' />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div
          className='prose prose-sm max-w-none'
          dangerouslySetInnerHTML={{ __html: description }}
        />

        <div className='flex justify-end mt-6'>
          <Button onClick={onClose} variant='outline'>
            閉じる
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
