'use client'

import { Home, Wallet, PiggyBank, ListChecks, Bot } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  key: string
  label: string
  icon: LucideIcon
}

const items: NavItem[] = [
  { key: 'home', label: 'ホーム', icon: Home },
  { key: 'money', label: '収支', icon: Wallet },
  { key: 'savings', label: '貯金', icon: PiggyBank },
  { key: 'tasks', label: 'タスク', icon: ListChecks },
  { key: 'ai', label: 'AI顧問', icon: Bot },
]

export function BottomNav({
  active,
  onChange,
}: {
  active: string
  onChange: (key: string) => void
}) {
  return (
    <nav
      className="pointer-events-auto mx-auto w-full max-w-[430px] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      aria-label="メインナビゲーション"
    >
      <ul className="flex items-center justify-around rounded-full border border-border/60 bg-card/90 px-2 py-2 shadow-lg shadow-matcha/10 backdrop-blur-md">
        {items.map((item) => {
          const isActive = item.key === active
          const Icon = item.icon
          return (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => onChange(item.key)}
                aria-current={isActive ? 'page' : undefined}
                className="flex flex-col items-center gap-0.5 rounded-full px-2 py-1.5 transition-colors"
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
                    isActive
                      ? 'scale-110 bg-matcha text-primary-foreground shadow-sm shadow-matcha/30'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    isActive ? 'text-matcha' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
