import '@/app/globals.css';

import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { Toaster } from '@/components/ui/toaster';
import PwaScript from '@/components/common/PwaScript';
import { ActiveTabProvider } from '@/contexts/active-tab-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Markdown To PlainText',
  description: 'Markdown to PlainText converter',
  manifest: '/manifest.json',
  applicationName: 'Markdown To PlainText',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Markdown To PlainText',
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' }],
  },
  other: {
    'msapplication-TileColor': '#0f172a',
    'msapplication-tap-highlight': 'no',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja'>
      <head>
        <meta name='application-name' content='TimePort' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='TimePort' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='msapplication-TileColor' content='#0f172a' />
        <meta name='msapplication-tap-highlight' content='no' />

        <link rel='apple-touch-icon' href='/android-chrome-192x192.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-16x16.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='mask-icon' href='/android-chrome-192x192.png' color='#0f172a' />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ActiveTabProvider>{children}</ActiveTabProvider>
        <Toaster />
        <PwaScript />
      </body>
    </html>
  );
}
