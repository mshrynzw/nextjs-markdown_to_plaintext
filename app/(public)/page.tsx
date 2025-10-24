'use client';

import {
  ArrowRight,
  BarChart3,
  Calendar,
  Check,
  Clock,
  MessageSquare,
  Play,
  Shield,
  Star,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-static';
export default function Home() {
  const features = [
    {
      icon: Clock,
      title: '給与管理',
      description: 'リアルタイムでの給与計算と支払い管理',
    },
    {
      icon: BarChart3,
      title: 'ダッシュボード',
      description: '直感的なダッシュボードで業務状況を一目で把握',
    },
    {
      icon: MessageSquare,
      title: '勤怠管理',
      description: 'リアルタイムでの出退勤管理と勤務時間の自動計算',
    },
    {
      icon: Calendar,
      title: 'スケジュール管理',
      description: '効率的なスケジュール管理とリクエスト処理',
    },
    {
      icon: Shield,
      title: 'セキュリティ',
      description: '企業レベルのセキュリティでデータを保護',
    },
    {
      icon: Users,
      title: 'マルチテナント',
      description: '複数の組織に対応した柔軟な管理システム',
    },
  ];

  const benefits = [
    'リアルタイム給与管理',
    '直感的なダッシュボード',
    'チームコミュニケーション',
    'モバイル対応',
    'セキュアなデータ管理',
    'カスタマイズ可能',
  ];

  const screenshots = [
    { src: '/images/app/member-dashboard.png', alt: '従業員のダッシュボード' },
    { src: '/images/app/admin-dashboard.png', alt: '管理者のダッシュボード' },
    {
      src: '/images/app/admin-dashboard-help.png',
      alt: '管理者のダッシュボード（ヘルプ）',
    },
    { src: '/images/app/admin-attendance.png', alt: '管理者の勤怠管理' },
    { src: '/images/app/admin-paypall.png', alt: '管理者給与管理' },
  ];

  return (
    <main className='min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-900 relative overflow-x-hidden'>
      {/* Animated background elements */}
      <div className='absolute inset-0'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse'></div>
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000'></div>
      </div>

      <header className='z-20 m-8 flex justify-end'>
        <Button
          onClick={() => {
            redirect('/login');
          }}
          className='timeport-gradient hover:opacity-90 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'
        >
          ログイン
        </Button>
      </header>
      {/* Hero Section */}
      <section className='relative z-10 pt-20 pb-32 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center'>
            {/* Logo */}
            <div className='flex justify-center mb-8'>
              <div className='relative'>
                <div className='absolute inset-0 timeport-gradient rounded-full blur-lg opacity-60 animate-pulse'></div>
                <div className='relative bg-white/10 backdrop-blur-md rounded-full p-6 border border-white/20'>
                  <Clock className='w-16 h-16 text-white' />
                </div>
              </div>
            </div>

            {/* Main headline */}
            <h1 className='text-6xl sm:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-white via-yellow-200 to-orange-300 bg-clip-text text-transparent mb-6 animate-fade-in'>
              TimePort
            </h1>

            {/* Subtitle */}
            <p className='text-2xl sm:text-3xl font-semibold text-white mb-6 animate-fade-in animation-delay-200'>
              次世代の勤怠管理・チーム協働プラットフォーム
            </p>

            {/* Description */}
            <p className='text-lg sm:text-xl text-gray-200 max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in animation-delay-400'>
              マルチテナント対応の包括的な業務管理ソリューションで、あらゆる規模の組織の生産性を向上させます
            </p>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in animation-delay-600'>
              <Button className='timeport-gradient hover:opacity-90 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'>
                今すぐ始める
                <ArrowRight className='ml-2 w-5 h-5' />
              </Button>
              <Button
                variant='outline'
                className='border-white/30 hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-md transition-all duration-200'
              >
                <Play className='mr-2 w-5 h-5' />
                デモを見る
              </Button>
            </div>

            {/* Statistics */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in animation-delay-800'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-white mb-2'>500+</div>
                <div className='text-gray-300'>導入企業数</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-white mb-2'>50,000+</div>
                <div className='text-gray-300'>アクティブユーザー</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-white mb-2'>99.9%</div>
                <div className='text-gray-300'>稼働率</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='relative z-10 py-32 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-20'>
            <h2 className='text-4xl sm:text-5xl font-bold text-white mb-6'>
              包括的な業務管理ソリューション
            </h2>
            <p className='text-xl text-gray-200 max-w-3xl mx-auto'>
              TimePortは、勤怠管理からチーム協働まで、あらゆる業務を効率化する統合プラットフォームです
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className='bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 group'
                >
                  <CardContent className='p-8 text-center'>
                    <div className='relative mb-6'>
                      <div className='absolute inset-0 timeport-gradient rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300'></div>
                      <div className='relative bg-white/10 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center'>
                        <IconComponent className='w-10 h-10 text-white' />
                      </div>
                    </div>
                    <h3 className='text-xl font-semibold text-white mb-4'>{feature.title}</h3>
                    <p className='text-gray-200 leading-relaxed'>{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className='relative z-10 py-32 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
            {/* Text content */}
            <div>
              <h2 className='text-4xl sm:text-5xl font-bold text-white mb-8'>TimePortを選ぶ理由</h2>
              <p className='text-xl text-gray-200 mb-12 leading-relaxed'>
                マルチテナント対応により、あらゆる規模の組織に最適化された柔軟で安全な業務管理システムを提供します
              </p>

              <div className='space-y-6'>
                {benefits.map((benefit, index) => (
                  <div key={index} className='flex items-center space-x-4'>
                    <div className='timeport-gradient rounded-full p-1'>
                      <Check className='w-5 h-5 text-white' />
                    </div>
                    <span className='text-lg text-white'>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Screenshots */}
            <div className='grid grid-cols-2 gap-4'>
              {screenshots.map((screenshot, index) => (
                <div
                  key={index}
                  className='relative group overflow-hidden rounded-xl bg-white/10 backdrop-blur-md border border-white/20'
                >
                  <div className='aspect-video bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center'>
                    <Image
                      src={screenshot.src}
                      alt={screenshot.alt}
                      width={500}
                      height={500}
                      priority
                    />
                  </div>
                  <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='relative z-10 py-32 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <Card className='bg-white/10 backdrop-blur-md border-white/20 shadow-2xl'>
            <CardContent className='p-12 text-center'>
              <h2 className='text-4xl sm:text-5xl font-bold text-white mb-6'>
                今すぐTimePortを始めましょう
              </h2>
              <p className='text-xl text-gray-200 mb-12 max-w-2xl mx-auto'>
                無料トライアルで、TimePortの全機能をお試しください。導入サポートも充実しています。
              </p>

              <div className='flex flex-col sm:flex-row gap-4 justify-center mb-8'>
                <Button className='timeport-gradient hover:opacity-90 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'>
                  無料で始める
                  <ArrowRight className='ml-2 w-5 h-5' />
                </Button>
                <Button
                  variant='outline'
                  className='border-white/30 hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-md transition-all duration-200'
                >
                  資料をダウンロード
                </Button>
              </div>

              <div className='flex items-center justify-center text-gray-300'>
                <Star className='w-5 h-5 mr-2 text-yellow-400' />
                <span>30日間無料トライアル・クレジットカード不要</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className='relative z-10 py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex flex-col items-center'>
            {/* Logo */}
            <div className='flex items-center space-x-3 mb-6'>
              <div className='bg-white/10 backdrop-blur-md rounded-full p-3 border border-white/20'>
                <Clock className='w-8 h-8 text-white' />
              </div>
              <span className='text-2xl font-bold text-white'>TimePort</span>
            </div>

            {/* Copyright */}
            <p className='text-gray-300 text-center text-sm'>
              © 2024 TimePort. All rights reserved. |
              マルチテナント対応の勤怠管理・チーム協働プラットフォーム
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
