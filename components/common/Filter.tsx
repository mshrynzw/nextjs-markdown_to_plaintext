'use client';

import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { ReactNode, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BaseFilterProps {
  activeFiltersCount: number;
  onClearFilters: () => void;
  children: ReactNode;
  title?: string;
}

export default function BaseFilter({
  activeFiltersCount,
  onClearFilters,
  children,
  title = 'フィルター',
}: BaseFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className='mb-6 w-full'>
      <CardContent
        onClick={!isExpanded ? () => setIsExpanded(!isExpanded) : undefined}
        className={`p-4 ${!isExpanded ? 'hover:cursor-pointer' : ''}`}
      >
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center space-x-2'>
            <Filter className='w-4 h-4 text-gray-600' />
            <span className='font-medium text-gray-900'>{title}</span>
            {activeFiltersCount > 0 && (
              <Badge variant='secondary' className='ml-2'>
                {activeFiltersCount}件適用中
              </Badge>
            )}
          </div>
          <div className='flex items-center space-x-2'>
            {activeFiltersCount > 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={onClearFilters}
                className='text-gray-500 hover:text-gray-700'
              >
                <X className='w-4 h-4 mr-1' />
                クリア
              </Button>
            )}
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setIsExpanded(!isExpanded)}
              className='text-gray-500 hover:text-gray-700'
            >
              {isExpanded ? (
                <>
                  <ChevronUp className='w-4 h-4 mr-1' />
                  折りたたむ
                </>
              ) : (
                <>
                  <ChevronDown className='w-4 h-4 mr-1' />
                  展開
                </>
              )}
            </Button>
          </div>
        </div>

        {isExpanded && <div className='space-y-4'>{children}</div>}
      </CardContent>
    </Card>
  );
}
