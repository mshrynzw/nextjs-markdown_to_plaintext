import { Clipboard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/app-context';

interface MarkdownTextAreaProps {
  className?: string;
  markdown: string;
  onPaste: () => void;
  onChange: (value: string) => void;
}

export default function MarkdownTextArea({
  className,
  markdown,
  onPaste,
  onChange,
}: MarkdownTextAreaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };
  return (
    <div className='flex flex-col space-y-2 w-full h-full'>
      <Button
        variant='outline'
        className='w-full hidden lg:flex flex-row space-x-2 items-center'
        onClick={onPaste}
      >
        <Clipboard className='w-4 h-4' />
        <div>Paste Markdown</div>
      </Button>
      <div className='hidden lg:block w-full h-full p-4 bg-white/10 border border-white/20 rounded-lg overflow-y-auto custom-scrollbar'>
        <MarkdownRenderer content={markdown} className={className} />
      </div>
      <div className='block lg:hidden w-full h-full p-4 bg-white/10 border border-white/20 rounded-lg overflow-y-auto custom-scrollbar'>
        <Textarea
          value={markdown}
          onChange={handleChange}
          placeholder='Enter your Markdown text here...'
          className={`font-mono text-sm ${className || ''}`}
        />
      </div>
    </div>
  );
}
