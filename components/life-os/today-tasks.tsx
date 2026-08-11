'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

interface Task {
  id: number
  title: string
  tag: string
  done: boolean
}

const initialTasks: Task[] = [
  { id: 1, title: '今日の収支を記録する', tag: 'お金', done: true },
  { id: 2, title: '新規クライアントに見積もり送付', tag: '仕事', done: false },
  { id: 3, title: '積立NISAの配分を見直す', tag: '投資', done: false },
  { id: 4, title: '30分の散歩でリフレッシュ', tag: '健康', done: false },
]

const tagColor: Record<string, string> = {
  お金: 'bg-matcha/10 text-matcha',
  仕事: 'bg-sakura/25 text-sakura-foreground',
  投資: 'bg-yuzu/25 text-yuzu-foreground',
  健康: 'bg-matcha-light/15 text-matcha-dark',
}

export function TodayTasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const doneCount = tasks.filter((t) => t.done).length

  function toggle(id: number) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
  }

  return (
    <section
      className="animate-rise-in rounded-3xl bg-card p-5 shadow-sm"
      style={{ animationDelay: '0.16s' }}
      aria-label="今日のタスク"
    >
      <div className="flex items-baseline justify-between">
        <h2 className="font-rounded text-base font-bold text-foreground">
          今日のタスク
        </h2>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold tabular-nums text-matcha">
          {doneCount}/{tasks.length} 完了
        </span>
      </div>

      <ul className="mt-3 flex flex-col gap-2">
        {tasks.map((task) => (
          <li key={task.id}>
            <button
              type="button"
              onClick={() => toggle(task.id)}
              aria-pressed={task.done}
              className="flex w-full items-center gap-3 rounded-2xl bg-secondary/50 px-3 py-3 text-left transition-colors active:bg-secondary"
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  task.done
                    ? 'scale-100 border-matcha bg-matcha'
                    : 'border-border bg-card'
                }`}
              >
                <Check
                  className={`h-3.5 w-3.5 text-primary-foreground transition-transform duration-300 ${
                    task.done ? 'scale-100' : 'scale-0'
                  }`}
                  strokeWidth={3}
                  aria-hidden="true"
                />
              </span>

              <span
                className={`flex-1 text-sm font-medium transition-all ${
                  task.done
                    ? 'text-muted-foreground line-through'
                    : 'text-foreground'
                }`}
              >
                {task.title}
              </span>

              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  tagColor[task.tag] ?? 'bg-secondary text-muted-foreground'
                }`}
              >
                {task.tag}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
