'use client';

import { Eye, EyeOff, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  return (
    <form
      onSubmit={async (e) => {
        setIsLoading(true);
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        if (formData.get('email') && formData.get('password')) {
          toast({
            title: 'ログイン',
            description: 'ログインします',
            variant: 'default',
          });
          router.replace('/admin/dashboard');
          return;
        } else {
          setIsLoading(false);
          setError('メールアドレスとパスワードを入力してください');
        }
      }}
      className='space-y-6'
    >
      {/* // <form action="/api/login" method="post" className="space-y-6"> */}
      <div className='space-y-2'>
        <Label htmlFor='email' className='text-white font-medium'>
          メールアドレス
        </Label>
        <Input
          id='email'
          name='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='メールアドレスを入力'
          required
          disabled={isLoading}
          autoComplete='username'
          className='bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-orange-400 focus:ring-orange-400/20 backdrop-blur-sm'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='password' className='text-white font-medium'>
          パスワード
        </Label>
        <div className='relative'>
          <Input
            id='password'
            name='password'
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='パスワードを入力'
            required
            disabled={isLoading}
            autoComplete='current-password'
            className='bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-orange-400 focus:ring-orange-400/20 backdrop-blur-sm pr-12'
          />
          <button
            type='button'
            onClick={() => setShowPassword((v) => !v)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors'
          >
            {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
          </button>
        </div>
      </div>

      {error && (
        <div className='p-3 bg-red-500/20 border border-red-400/30 rounded-lg backdrop-blur-sm'>
          <p className='text-red-200 text-sm text-center'>{error}</p>
        </div>
      )}

      <Button
        type='submit'
        className='w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]'
        disabled={isLoading}
        aria-disabled={isLoading}
      >
        {isLoading ? (
          <span className='flex items-center gap-2'>
            <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
            ログイン中…
          </span>
        ) : (
          <span className='flex items-center gap-2'>
            <Shield className='w-4 h-4' />
            ログイン
          </span>
        )}
      </Button>
    </form>
  );
}
