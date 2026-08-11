import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'いぶきの人生経営',
    short_name: 'いぶき経営',
    description:
      '純資産・収支・貯金・タスク・AI顧問をひとつに。あなたの人生を経営するための抹茶色 Life OS。',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f9f5',
    theme_color: '#4a5d2c',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/app-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  }
}
