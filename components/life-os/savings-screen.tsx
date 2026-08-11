'use client'

import { useState } from 'react'
import { Plus, Target, CalendarDays, TrendingUp } from 'lucide-react'

interface Pod {
  id: number
  name: string
  emoji: string
  target: number
  current: number
  deadline: string
  color: string
}

const initialPods: Pod[] = [
  {
    id: 1,
    name: '奨学金返済',
    emoji: '🎓',
    target: 2400000,
    current: 1560000,
    deadline: '2027年3月',
    color: 'var(--matcha)',
  },
  {
    id: 2,
    name: 'ハワイ旅行用',
    emoji: '🌺',
    target: 500000,
    current: 320000,
    deadline: '2026年8月',
    color: 'var(--yuzu)',
  },
  {
    id: 3,
    name: '非常用資金',
    emoji: '🛟',
    target: 1000000,
    current: 850000,
    deadline: '2026年12月',
    color: 'var(--sakura)',
  },
  {
    id: 4,
    name: '新しいPC用',
    emoji: '💻',
    target: 300000,
    current: 90000,
    deadline: '2026年10月',
    color: 'var(--matcha-light)',
  },
]

const yen = (n: number) => `¥${n.toLocaleString('ja-JP')}`

export function SavingsScreen() {
  const [pods] = useState<Pod[]>(initialPods)

  const totalTarget = pods.reduce((s, p) => s + p.target, 0)
  const totalCurrent = pods.reduce((s, p) => s + p.current, 0)
  const totalRate = Math.round((totalCurrent / totalTarget) * 100)

  return (
    <div className="flex flex-col gap-4">
      {/* total summary */}
      <section
        className="animate-rise-in relative overflow-hidden rounded-3xl p-6 text-primary-foreground shadow-lg shadow-matcha/30"
        style={{
          background:
            'linear-gradient(135deg, var(--matcha-dark) 0%, var(--matcha) 55%, var(--matcha-light) 100%)',
        }}
        aria-label="全貯蓄・返済の総進捗率"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-bold opacity-90">全貯蓄・返済の総進捗率</p>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="font-rounded text-4xl font-black tabular-nums">
              {totalRate}
              <span className="text-2xl">%</span>
            </p>
            <p className="mt-1 text-sm font-medium opacity-90 tabular-nums">
              {yen(totalCurrent)}{' '}
              <span className="opacity-70">/ {yen(totalTarget)}</span>
            </p>
          </div>
          <span className="rounded-full bg-yuzu px-3 py-1 text-xs font-black text-yuzu-foreground shadow-sm">
            {pods.length}つの目標
          </span>
        </div>
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-background/25">
          <div
            className="h-full origin-left rounded-full bg-yuzu"
            style={{
              width: `${totalRate}%`,
              animation: 'bar-grow 0.9s cubic-bezier(0.22,1,0.36,1) both',
            }}
          />
        </div>
      </section>

      {/* pod cards */}
      <ul className="flex flex-col gap-3">
        {pods.map((pod, i) => {
          const rate = Math.min(
            100,
            Math.round((pod.current / pod.target) * 100),
          )
          const remaining = Math.max(0, pod.target - pod.current)
          return (
            <li
              key={pod.id}
              className="animate-rise-in rounded-3xl bg-card p-5 shadow-sm"
              style={{ animationDelay: `${0.06 + i * 0.05}s` }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-xl"
                  style={{ backgroundColor: `${pod.color}22` }}
                >
                  {pod.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-rounded text-base font-black text-foreground">
                    {pod.name}
                  </h3>
                  <p className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                    <CalendarDays className="h-3 w-3" aria-hidden="true" />
                    {pod.deadline}まで
                  </p>
                </div>
                <span
                  className="font-rounded text-lg font-black tabular-nums"
                  style={{ color: pod.color }}
                >
                  {rate}%
                </span>
              </div>

              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full origin-left rounded-full"
                  style={{
                    width: `${rate}%`,
                    backgroundColor: pod.color,
                    animation: 'bar-grow 0.9s cubic-bezier(0.22,1,0.36,1) both',
                  }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="font-bold text-foreground tabular-nums">
                  {yen(pod.current)}
                  <span className="font-medium text-muted-foreground">
                    {' '}
                    / {yen(pod.target)}
                  </span>
                </span>
                <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 font-bold text-matcha tabular-nums">
                  <Target className="h-3 w-3" aria-hidden="true" />
                  残り {yen(remaining)}
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      {/* add new goal */}
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-matcha/40 bg-card py-4 text-base font-bold text-matcha transition-transform active:scale-[0.98]"
      >
        <Plus className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
        新しい貯金目標を追加
      </button>
    </div>
  )
}
