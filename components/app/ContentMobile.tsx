import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useApp } from '@/contexts/app-context';

import MarkdownTextArea from './MarkdownTextArea';
import PlainTextArea from './PlainTextArea';

interface ContentMobileProps {
  handlePaste: () => void;
  handleCopy: () => void;
  handleMarkdownChange: (value: string) => void;
}

export default function ContentMobile({
  handlePaste,
  handleCopy,
  handleMarkdownChange,
}: ContentMobileProps) {
  const { activeTab, setActiveTab, markdown, plainText } = useApp();

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as 'markdown' | 'plaintext')}
      className='w-full h-full'
    >
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='markdown'>Markdown</TabsTrigger>
        <TabsTrigger value='plaintext'>Plain Text</TabsTrigger>
      </TabsList>
      <TabsContent value='markdown' className='flex-1 h-full overflow-hidden'>
        <MarkdownTextArea
          className='h-full custom-scrollbar'
          markdown={markdown}
          onPaste={handlePaste}
          onChange={handleMarkdownChange}
        />
      </TabsContent>
      <TabsContent value='plaintext' className='flex-1 h-full overflow-hidden'>
        <PlainTextArea
          className='h-full custom-scrollbar'
          plainText={plainText}
          onCopy={handleCopy}
        />
      </TabsContent>
    </Tabs>
  );
}
