import MarkdownTextArea from './MarkdownTextArea';
import PlainTextArea from './PlainTextArea';

interface ContentDesktopProps {
  markdown: string;
  plainText: string;
  handlePaste: () => void;
  handleCopy: () => void;
}

export default function ContentDesktop({
  markdown,
  plainText,
  handlePaste,
  handleCopy,
}: ContentDesktopProps) {
  return (
    <>
      <div className='flex-1 w-1/2 h-full overflow-hidden'>
        <MarkdownTextArea
          className='h-full custom-scrollbar'
          markdown={markdown}
          onPaste={handlePaste}
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
