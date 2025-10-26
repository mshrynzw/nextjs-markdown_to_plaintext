import { useApp } from '@/contexts/app-context';

import MarkdownTextArea from './MarkdownTextArea';
import PlainTextArea from './PlainTextArea';

interface ContentDesktopProps {
  handlePaste: () => void;
  handleCopy: () => void;
  handleMarkdownChange: (value: string) => void;
}

export default function ContentDesktop({
  handlePaste,
  handleCopy,
  handleMarkdownChange,
}: ContentDesktopProps) {
  const { markdown, plainText } = useApp();
  return (
    <>
      <div className='flex-1 w-1/2 h-full overflow-hidden'>
        <MarkdownTextArea
          className='h-full custom-scrollbar'
          markdown={markdown}
          onPaste={handlePaste}
          onChange={handleMarkdownChange}
        />
      </div>
      <div className='flex-1 w-1/2 h-full overflow-hidden'>
        <PlainTextArea
          className='h-full custom-scrollbar'
          plainText={plainText}
          onCopy={handleCopy}
        />
      </div>
    </>
  );
}
