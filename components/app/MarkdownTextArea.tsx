import { Clipboard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer';

interface MarkdownTextAreaProps {
  className?: string;
  markdown: string;
  onPaste: () => void;
}

export default function MarkdownTextArea({ className, markdown, onPaste }: MarkdownTextAreaProps) {
  return (
    <div className='flex flex-col space-y-2 w-full h-full'>
      <Button
        variant='outline'
        className='w-full flex flex-row space-x-2 items-center'
        onClick={onPaste}
      >
        <Clipboard className='w-4 h-4' />
        <div>Paste Markdown</div>
      </Button>
      <div className='w-full h-full p-4 bg-white/10 border border-white/20 rounded-lg overflow-y-auto custom-scrollbar'>
        <MarkdownRenderer content={markdown} className={className} />
      </div>
    </div>
  );
}
