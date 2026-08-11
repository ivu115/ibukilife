import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Zen_Maru_Gothic, Zen_Kaku_Gothic_New } from 'next/font/google'
import './globals.css'

const zenMaru = Zen_Maru_Gothic({
  subsets: ['latin'],
  weight: ['500', '700', '900'],
  variable: '--font-zen-maru',
})

const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-zen-kaku',
})

export const metadata: Metadata = {
  title: 'いぶきの人生経営',
  description:
    '純資産・収支・貯金・タスク・AI顧問をひとつに。あなたの人生を経営するための抹茶色 Life OS ダッシュボード。',
  applicationName: 'いぶきの人生経営',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'いぶきの人生経営',
    statusBarStyle: 'default',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#5b7039',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`bg-background ${zenMaru.variable} ${zenKaku.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
