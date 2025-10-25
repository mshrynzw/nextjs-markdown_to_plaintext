'use client';
import { FileType2 } from 'lucide-react';
import { useState, useCallback } from 'react';

import Particles from '@/components/common/Particles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ContentDesktop from '@/components/app/ContentDesktop';
import ContentMobile from '@/components/app/ContentMobile';
import { markdownToPlainText } from '@/lib/markdown/to-plain-text';
import { useToast } from '@/hooks/use-toast';
import { useActiveTab } from '@/contexts/active-tab-context';

export default function Page() {
  const [markdown, setMarkdown] = useState('');
  const [plainText, setPlainText] = useState('');
  const { setActiveTab } = useActiveTab();
  const { toast } = useToast();

  const handlePaste = useCallback(async () => {
    try {
      // Check if clipboard API is available
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        setMarkdown(text);
        setPlainText(markdownToPlainText(text));
        setActiveTab('plaintext');
        toast({
          title: 'Markdown pasted',
          description: 'Markdown has been pasted to the textarea',
        });
      } else {
        // Fallback for iOS Safari/Chrome
        toast({
          title: 'Paste not supported',
          description: 'Please manually paste your Markdown text into the textarea',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      toast({
        title: 'Paste not supported',
        description: 'Please manually paste your Markdown text into the textarea',
        variant: 'destructive',
      });
    }
  }, [setActiveTab, toast]);

  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(plainText);
        toast({
          title: 'PlainText copied',
          description: 'PlainText has been copied to the clipboard',
        });
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = plainText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast({
          title: 'PlainText copied',
          description: 'PlainText has been copied to the clipboard',
        });
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast({
        title: 'Copy not supported',
        description: 'Please manually select and copy the text',
        variant: 'destructive',
      });
    }
  }, [plainText, toast]);

  return (
    <div className='h-screen relative overflow-hidden flex flex-col p-4'>
      {/* Animated Gradient Background */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600'>
        <div className='absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-indigo-600/20 to-purple-500/20'></div>

        {/* Animated Orbs */}
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-indigo-500/30 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-400/30 to-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 rounded-full blur-2xl animate-pulse delay-500'></div>

        {/* Floating Particles */}
        <Particles />
      </div>

      {/* Title */}
      <Card className='w-full h-full relative z-10 bg-white/10 border-white/20 shadow-2xl flex flex-col'>
        <CardHeader className='hidden lg:block text-center pb-4 flex-shrink-0'>
          <div className='flex justify-center'>
            <div className='relative flex flex-row space-x-4 items-center'>
              <div className='absolute inset-0 w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-lg opacity-60'></div>
              <div className='relative w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg'>
                <FileType2 className='w-10 h-10 text-white' />
              </div>
              <CardTitle className='hidden md:block text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent'>
                Markdown To PlainText
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        {/* Converter Desktop */}
        <CardContent className='flex-1 hidden lg:flex flex-row w-full justify-stretch space-x-2 p-6 overflow-hidden'>
          <ContentDesktop
            markdown={markdown}
            plainText={plainText}
            handlePaste={handlePaste}
            handleCopy={handleCopy}
          />
        </CardContent>

        {/* Content Mobile */}
        <CardContent className='flex-1 flex lg:hidden flex-row w-full justify-stretch space-x-2 p-6 overflow-hidden'>
          <ContentMobile
            markdown={markdown}
            plainText={plainText}
            handlePaste={handlePaste}
            handleCopy={handleCopy}
          />
        </CardContent>
      </Card>
    </div>
  );
}
