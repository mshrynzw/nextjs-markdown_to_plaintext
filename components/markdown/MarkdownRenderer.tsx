'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { markdownSanitizeSchema } from '@/lib/markdown/sanitize-schema';
import '@/styles/github-markdown.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  isDark?: boolean;
  variant?: 'default' | 'compact' | 'chat' | 'board';
  showLineNumbers?: boolean;
  maxHeight?: string;
}

export default function MarkdownRenderer({
  content,
  className,
  isDark = false,
  variant = 'default',
  showLineNumbers = false,
  maxHeight,
}: MarkdownRendererProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'chat':
        return 'prose max-w-none dark:prose-invert';
      case 'board':
        return 'prose max-w-none dark:prose-invert prose-sm';
      case 'compact':
        return 'prose max-w-none dark:prose-invert prose-sm prose-headings:text-base';
      default:
        return 'prose max-w-none dark:prose-invert';
    }
  };

  const containerStyle = maxHeight ? { maxHeight, overflowY: 'auto' as const } : {};

  return (
    <div className={`${getVariantStyles()} markdown-body ${className}`} style={containerStyle}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, markdownSanitizeSchema]]}
        components={{
          a: ({ node, ...props }) => (
            <a
              {...props}
              target='_blank'
              rel='noopener noreferrer'
              className='underline underline-offset-2 hover:opacity-80'
            />
          ),
          p: ({ node, ...props }) => <p style={{ whiteSpace: 'pre-line' }} {...props} />,
          code({ node, className, children, ...props }) {
            // インライン: node.type !== 'code'
            const isInline = node?.tagName !== 'code';
            const match = /language-(\w+)/.exec(className || '');
            const language = match?.[1];
            if (!isInline && language) {
              return (
                <SyntaxHighlighter
                  style={isDark ? oneDark : oneLight}
                  language={language}
                  PreTag='div'
                  showLineNumbers={showLineNumbers}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              );
            }
            return (
              <code className='bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm' {...props}>
                {children}
              </code>
            );
          },
          table: ({ node, ...props }) => (
            <div className='w-full overflow-x-auto'>
              <table
                className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className='bg-gray-50 dark:bg-gray-800' {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
