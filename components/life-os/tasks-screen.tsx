'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

interface Task {
  id: number
  title: string
  tag: string
  time: string
  done: boolean
}

const initialTasks: Task[] = [
  { id: 1, title: '今日の収支を記録する', tag: 'お金', time: '9:00', done: true },
  { id: 2, title: '新規クライアントに見積もり送付', tag: '仕事', time: '11:00', done: true },
  { id: 3, title: '積立NISAの配分を見直す', tag: '投資', time: '14:00', done: true },
  { id: 4, title: 'SNS投稿を3件予約する', tag: '仕事', time: '15:30', done: false },
  { id: 5, title: '30分の散歩でリフレッシュ', tag: '健康', time: '18:00', done: false },
  { id: 6, title: '読書30ページ（経営本）', tag: '投資', time: '21:00', done: false },
  { id: 7, title: '明日のタスクを棚卸しする', tag: 'お金', time: '22:00', done: true },
  { id: 8, title: '水を2リットル飲む', tag: '健康', time: '終日', done: false },
]

const tagColor: Record<string, string> = {
  お金: 'bg-matcha/10 text-matcha',
  仕事: 'bg-sakura/25 text-sakura-foreground',
  投資: 'bg-yuzu/25 text-yuzu-foreground',
  健康: 'bg-matcha-light/15 text-matcha-dark',
}

const filters = ['すべて', 'お金', '仕事', '投資', '健康']

export function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filter, setFilter] = useState('すべて')

  const doneCount = tasks.filter((t) => t.done).length
  const rate = Math.round((doneCount / tasks.length) * 100)

  const visible =
    filter === 'すべて' ? tasks : tasks.filter((t) => t.tag === filter)

  function toggle(id: number) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* achievement ring */}
      <section
        className="animate-rise-in flex items-center gap-5 rounded-3xl bg-card p-5 shadow-sm"
        aria-label="今日の達成率"
      >
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--secondary)"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--matcha)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 42}
              strokeDashoffset={2 * Math.PI * 42 * (1 - rate / 100)}
              style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.22,1,0.36,1)' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-rounded text-2xl font-black tabular-nums text-matcha">
              {rate}%
            </span>
            <span className="text-[10px] font-bold text-muted-foreground">達成</span>
          </div>
        </div>
        <div>
          <h2 className="font-rounded text-lg font-black text-foreground">
            いい調子です🍵
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-bold text-matcha tabular-nums">{doneCount}</span>
            /{tasks.length} 件のタスクが完了
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            残り{tasks.length - doneCount}件、片手間にサクッと🌱
          </p>
        </div>
      </section>

      {/* category filter */}
      <div
        className="animate-rise-in -mx-4 flex gap-2 overflow-x-auto px-4 pb-1"
        style={{ animationDelay: '0.06s' }}
        role="tablist"
        aria-label="カテゴリフィルター"
      >
        {filters.map((f) => {
          const selected = f === filter
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all active:scale-95 ${
                selected
                  ? 'bg-matcha text-primary-foreground shadow-sm shadow-matcha/25'
                  : 'bg-card text-muted-foreground'
              }`}
            >
              {f}
            </button>
          )
        })}
      </div>

      {/* task cards */}
      <ul className="flex flex-col gap-2.5">
        {visible.map((task, i) => (
          <li
            key={task.id}
            className="animate-rise-in"
            style={{ animationDelay: `${0.1 + i * 0.04}s` }}
          >
            <button
              type="button"
              onClick={() => toggle(task.id)}
              aria-pressed={task.done}
              className="flex w-full items-center gap-3 rounded-3xl bg-card px-4 py-4 text-left shadow-sm transition-transform active:scale-[0.99]"
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  task.done ? 'border-matcha bg-matcha' : 'border-border bg-card'
                }`}
              >
                <Check
                  className={`h-4 w-4 text-primary-foreground transition-transform duration-300 ${
                    task.done ? 'scale-100' : 'scale-0'
                  }`}
                  strokeWidth={3}
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0 flex-1">
                <span
                  className={`block truncate text-sm font-medium transition-all ${
                    task.done
                      ? 'text-muted-foreground line-through'
                      : 'text-foreground'
                  }`}
                >
                  {task.title}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
                  {task.time}
                </span>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                  tagColor[task.tag] ?? 'bg-secondary text-muted-foreground'
                }`}
              >
                {task.tag}
              </span>
            </button>
          </li>
        ))}
        {visible.length === 0 && (
          <li className="rounded-3xl bg-card p-8 text-center text-sm text-muted-foreground shadow-sm">
            このカテゴリのタスクはありません🌿
          </li>
        )}
      </ul>
    </div>
  )
}
