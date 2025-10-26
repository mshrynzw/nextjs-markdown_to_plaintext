import { Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/app-context';

interface PlainTextAreaProps {
  className?: string;
  onCopy: () => void;
}

export default function PlainTextArea({ className, onCopy }: PlainTextAreaProps) {
  const { plainText } = useApp();
  return (
    <div className='flex flex-col space-y-2 w-full h-full'>
      <Button
        variant='outline'
        className='w-full flex flex-row space-x-2 items-center'
        onClick={onCopy}
      >
        <Copy className='w-4 h-4' />
        <div>Copy PlainText</div>
      </Button>
      <div
        className={`w-full h-full p-4 bg-white/10 border border-white/20 rounded-lg whitespace-pre-line overflow-y-auto custom-scrollbar ${className || ''}`}
      >
        {plainText}
      </div>
    </div>
  );
}
