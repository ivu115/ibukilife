'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { NetWorthCard } from './net-worth-card'
import { PLSummary } from './pl-summary'
import { TodayTasks } from './today-tasks'
import { AIAdvisor } from './ai-advisor'
import { BottomNav } from './bottom-nav'
import { QuickInputSheet } from './quick-input-sheet'
import { MoneyScreen } from './money-screen'
import { TasksScreen } from './tasks-screen'
import { AIScreen } from './ai-screen'

const headings: Record<string, { sub: string; title: string }> = {
  home: { sub: 'おかえりなさい、経営者さん', title: '抹茶 Life OS 🍵' },
  money: { sub: 'サッと記録しましょう', title: '収支入力 ⚡' },
  tasks: { sub: '今日のミッション', title: 'タスク ✓' },
  ai: { sub: 'あなたの経営を診断', title: 'AI顧問 🍵' },
}

export function Dashboard() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('home')

  const heading = headings[activeTab] ?? headings.home

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-background">
      {/* greeting header */}
      <header className="flex items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-2">
        <div key={activeTab} className="animate-rise-in">
          <p className="text-xs font-medium text-muted-foreground">
            {heading.sub}
          </p>
          <h1 className="font-rounded text-xl font-black text-foreground">
            {heading.title}
          </h1>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-matcha text-lg font-black text-primary-foreground shadow-sm shadow-matcha/25">
          柚
        </span>
      </header>

      {/* scrollable content — switches per tab */}
      <main className="flex-1 space-y-4 overflow-y-auto px-4 pb-32 pt-2">
        {activeTab === 'home' && (
          <>
            <NetWorthCard amount={3350000} changePercent={4.2} />
            <PLSummary />
            <TodayTasks />
            <AIAdvisor />
          </>
        )}
        {activeTab === 'money' && <MoneyScreen />}
        {activeTab === 'tasks' && <TasksScreen />}
        {activeTab === 'ai' && <AIScreen />}
      </main>

      {/* floating action button — home only, opens the quick input sheet */}
      {activeTab === 'home' && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-40 mx-auto flex w-full max-w-[430px] justify-end px-6">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-label="収支を入力"
            className="animate-float-bob pointer-events-auto relative flex items-center justify-center rounded-full bg-matcha text-primary-foreground shadow-xl shadow-matcha/40 transition-transform active:scale-90"
            style={{ height: '3.75rem', width: '3.75rem' }}
          >
            <span className="absolute inset-0 -z-10 rounded-full bg-matcha/40 blur-md" />
            <Plus className="h-7 w-7" strokeWidth={2.75} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* fixed bottom nav */}
      <div className="fixed inset-x-0 bottom-0 z-40">
        <BottomNav active={activeTab} onChange={setActiveTab} />
      </div>

      <QuickInputSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  )
}
