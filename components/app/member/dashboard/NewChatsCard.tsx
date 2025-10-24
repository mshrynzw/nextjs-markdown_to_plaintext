'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface NewChatsCardProps {
  // 将来的にチャット機能が実装された際の props
  newChats?: ChatMessage[];
  maxDisplayCount?: number;
}

export default function NewChatsCard({ newChats = [], maxDisplayCount = 5 }: NewChatsCardProps) {
  // ハードコーディングされたチャットデータ（実際のアプリでは props から取得）
  const mockChats = [
    {
      id: '1',
      sender: '田中花子',
      message: 'お疲れ様です！明日の会議の件で...',
      timestamp: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      isRead: false,
    },
    {
      id: '2',
      sender: '佐藤太郎',
      message: '資料の確認をお願いします',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      isRead: true,
    },
    {
      id: '3',
      sender: '山田次郎',
      message: 'プロジェクトの進捗について',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      isRead: true,
    },
  ];

  // 実際のチャットデータまたはモックデータを使用
  const displayChats = newChats.length > 0 ? newChats : mockChats;
  const unreadChats = displayChats.filter((chat) => !chat.isRead);
  const recentChats = displayChats.slice(0, maxDisplayCount);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'たった今';
    } else if (diffInHours < 24) {
      return `${diffInHours}時間前`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}日前`;
    }
  };

  return (
    <Card className='h-full flex flex-col bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>新着チャット</span>
          {unreadChats.length > 0 && (
            <span className='bg-blue-500 text-white text-xs w-5 h-5 m-1 rounded-full flex items-center justify-center'>
              {unreadChats.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className='flex-1'>
        <div className='space-y-3'>
          {recentChats.length > 0 ? (
            recentChats.map((chat) => (
              <div
                key={chat.id}
                className={`p-3 rounded-lg border ${
                  chat.isRead
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-blue-50 border-blue-200 ring-2 ring-blue-100'
                }`}
              >
                <div className='flex items-start space-x-3'>
                  <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'>
                    <MessageSquare className='w-4 h-4 text-blue-600' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-sm font-medium text-gray-900'>{chat.sender}</span>
                      <span className='text-xs text-gray-500'>{formatTime(chat.timestamp)}</span>
                    </div>
                    <p className='text-sm text-gray-600 truncate'>{chat.message}</p>
                    {!chat.isRead && <div className='w-2 h-2 bg-blue-500 rounded-full mt-2'></div>}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='flex flex-col items-center justify-center py-8 text-gray-500'>
              <MessageSquare className='w-8 h-8 mb-2 text-gray-400' />
              <p className='text-sm'>新着チャットはありません</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
