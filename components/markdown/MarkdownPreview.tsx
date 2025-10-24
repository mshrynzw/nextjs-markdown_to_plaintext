'use client';
import React, { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

import MarkdownRenderer from './MarkdownRenderer';

interface MarkdownPreviewProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  textareaClassName?: string;
  previewClassName?: string;
  variant?: 'default' | 'compact' | 'chat' | 'board';
  isDark?: boolean;
  rows?: number;
  maxHeight?: string;
}

export default function MarkdownPreview({
  value,
  onChange,
  placeholder = 'マークダウン記法で入力してください...',
  className,
  textareaClassName,
  previewClassName,
  variant = 'default',
  isDark = false,
  rows = 10,
  maxHeight = '400px',
}: MarkdownPreviewProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='edit'>編集</TabsTrigger>
          <TabsTrigger value='preview'>プレビュー</TabsTrigger>
        </TabsList>

        <TabsContent value='edit' className='mt-2'>
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`font-mono text-sm ${textareaClassName || ''}`}
            rows={rows}
          />
          <div className='mt-2 text-xs text-gray-500'>
            <p>
              マークダウン記法が使用できます。**太字**、*斜体*、`コード`、# 見出し、- リストなど
            </p>
          </div>
        </TabsContent>

        <TabsContent value='preview' className='mt-2'>
          <div
            className={`border rounded-md p-4 bg-white dark:bg-gray-900 ${previewClassName || ''}`}
            style={{ maxHeight, overflowY: 'auto' }}
          >
            {value.trim() ? (
              <MarkdownRenderer
                content={value}
                variant={variant}
                isDark={isDark}
                className='min-h-[100px]'
              />
            ) : (
              <div className='text-gray-500 italic text-center py-8'>
                プレビューする内容がありません
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
