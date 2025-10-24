'use client';

import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface ColumnSettingsDialogProps<T extends Record<string, boolean>> {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: T) => void;
  currentSettings: T;
  columnLabels: Record<keyof T, string>;
  defaultSettings: T;
  title?: string;
}

export default function ColumnSettingsDialog<T extends Record<string, boolean>>({
  isOpen,
  onClose,
  onSave,
  currentSettings,
  columnLabels,
  defaultSettings,
  title = '列の表示設定',
}: ColumnSettingsDialogProps<T>) {
  const [settings, setSettings] = useState<T>(currentSettings);

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings]);

  const handleToggle = (key: keyof T) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelectAll = () => {
    setSettings(defaultSettings);
  };

  const handleDeselectAll = () => {
    setSettings(
      Object.keys(defaultSettings).reduce((acc, key) => ({ ...acc, [key]: false }), {} as T)
    );
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>{title}</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          {/* 操作ボタン */}
          <div className='flex justify-between items-center'>
            <div className='flex space-x-2'>
              <Button variant='outline' size='sm' onClick={handleSelectAll}>
                すべて選択
              </Button>
              <Button variant='outline' size='sm' onClick={handleDeselectAll}>
                すべて解除
              </Button>
              <Button variant='outline' size='sm' onClick={handleReset}>
                リセット
              </Button>
            </div>
            <div className='text-sm text-gray-600'>
              {Object.values(settings).filter(Boolean).length} / {Object.keys(settings).length}{' '}
              列が表示中
            </div>
          </div>

          <Separator />

          {/* 列設定 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>表示する列を選択してください</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-4'>
                {Object.entries(columnLabels).map(([key, label]) => (
                  <div key={key} className='flex items-center space-x-2'>
                    <Checkbox
                      id={key}
                      checked={settings[key as keyof T]}
                      onCheckedChange={() => handleToggle(key as keyof T)}
                    />
                    <label
                      htmlFor={key}
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 注意事項 */}
          <Card className='bg-yellow-50 border-yellow-200'>
            <CardContent className='p-4'>
              <div className='flex items-start space-x-2'>
                <div className='w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                  <span className='text-yellow-600 text-xs font-bold'>!</span>
                </div>
                <div className='text-sm text-yellow-800'>
                  <p className='font-medium mb-1'>注意事項</p>
                  <ul className='space-y-1 text-xs'>
                    <li>• 少なくとも1つの列は表示する必要があります</li>
                    <li>• 設定はブラウザのローカルストレージに保存されます</li>
                    <li>• 他のデバイスでは設定が共有されません</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* フッターボタン */}
        <div className='flex justify-end space-x-2 pt-4'>
          <Button variant='outline' onClick={onClose}>
            <X className='w-4 h-4 mr-2' />
            キャンセル
          </Button>
          <Button onClick={handleSave} disabled={Object.values(settings).every((value) => !value)}>
            <Check className='w-4 h-4 mr-2' />
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
