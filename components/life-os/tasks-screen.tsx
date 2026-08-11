'use client'

import { useMemo, useState } from 'react'
import { Check, Trash2, Plus, CalendarDays, List, X } from 'lucide-react'
import { MonthCalendar, toISO } from './month-calendar'

interface Task {
  id: number
  title: string
  tag: string
  date: string // ISO yyyy-mm-dd
  done: boolean
}

const t = new Date()
const d = (offset: number) => toISO(new Date(t.getFullYear(), t.getMonth(), t.getDate() + offset))

const initialTasks: Task[] = [
  { id: 1, title: '今日の収支を記録する', tag: 'お金', date: d(0), done: true },
  { id: 2, title: '新規クライアントに見積もり送付', tag: '仕事', date: d(0), done: true },
  { id: 3, title: '積立NISAの配分を見直す', tag: '投資', date: d(0), done: true },
  { id: 4, title: 'SNS投稿を3件予約する', tag: '仕事', date: d(1), done: false },
  { id: 5, title: '30分の散歩でリフレッシュ', tag: '健康', date: d(1), done: false },
  { id: 6, title: '読書30ページ（経営本）', tag: '投資', date: d(2), done: false },
  { id: 7, title: '明日のタスクを棚卸しする', tag: 'お金', date: d(0), done: true },
  { id: 8, title: '水を2リットル飲む', tag: '健康', date: d(3), done: false },
]

const tagColor: Record<string, string> = {
  お金: 'bg-matcha/10 text-matcha',
  仕事: 'bg-sakura/25 text-sakura-foreground',
  投資: 'bg-yuzu/25 text-yuzu-foreground',
  健康: 'bg-matcha-light/15 text-matcha-dark',
}

const filters = ['すべて', 'お金', '仕事', '投資', '健康']
const tagOptions = ['お金', '仕事', '投資', '健康']

const formatDate = (iso: string) => {
  const dt = new Date(iso)
  const w = ['日', '月', '火', '水', '木', '金', '土'][dt.getDay()]
  return `${dt.getMonth() + 1}/${dt.getDate()}(${w})`
}

export function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filter, setFilter] = useState('すべて')
  const [mode, setMode] = useState<'list' | 'calendar'>('list')

  // add-form state
  const [newTitle, setNewTitle] = useState('')
  const [newTag, setNewTag] = useState('仕事')
  const [newDate, setNewDate] = useState(d(0))
  const [pickerOpen, setPickerOpen] = useState(false)

  // calendar view selection
  const [selectedDate, setSelectedDate] = useState(d(0))

  const doneCount = tasks.filter((t) => t.done).length
  const rate = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0

  const marked = useMemo(() => {
    const m: Record<string, number> = {}
    for (const task of tasks) m[task.date] = (m[task.date] ?? 0) + 1
    return m
  }, [tasks])

  const listVisible =
    filter === 'すべて' ? tasks : tasks.filter((t) => t.tag === filter)
  const calendarVisible = tasks.filter((t) => t.date === selectedDate)

  function toggle(id: number) {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    )
  }

  function remove(id: number) {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  function addTask() {
    const title = newTitle.trim()
    if (!title) return
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), title, tag: newTag, date: newDate, done: false },
    ])
    setNewTitle('')
    setNewTag('仕事')
    setNewDate(d(0))
    setPickerOpen(false)
  }

  const renderTaskCard = (task: Task, i: number) => (
    <li
      key={task.id}
      className="animate-rise-in"
      style={{ animationDelay: `${0.06 + i * 0.04}s` }}
    >
      <div className="flex items-center gap-3 rounded-3xl bg-card px-4 py-4 shadow-sm">
        <button
          type="button"
          onClick={() => toggle(task.id)}
          aria-pressed={task.done}
          aria-label={`${task.title}を完了`}
          className="flex flex-1 items-center gap-3 text-left transition-transform active:scale-[0.99]"
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
            <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground tabular-nums">
              <CalendarDays className="h-3 w-3" aria-hidden="true" />
              {formatDate(task.date)}
            </span>
          </div>
        </button>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
            tagColor[task.tag] ?? 'bg-secondary text-muted-foreground'
          }`}
        >
          {task.tag}
        </span>
        <button
          type="button"
          onClick={() => remove(task.id)}
          aria-label={`${task.title}を削除`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-all active:scale-90 hover:bg-sakura/20 hover:text-sakura-foreground"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </li>
  )

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
              style={{
                transition: 'stroke-dashoffset 0.8s cubic-bezier(0.22,1,0.36,1)',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-rounded text-2xl font-black tabular-nums text-matcha">
              {rate}%
            </span>
            <span className="text-[10px] font-bold text-muted-foreground">
              達成
            </span>
          </div>
        </div>
        <div>
          <h2 className="font-rounded text-lg font-black text-foreground">
            いい調子です🍵
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-bold text-matcha tabular-nums">
              {doneCount}
            </span>
            /{tasks.length} 件のタスクが完了
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            残り{tasks.length - doneCount}件、片手間にサクッと🌱
          </p>
        </div>
      </section>

      {/* view toggle */}
      <div
        className="animate-rise-in flex rounded-full bg-secondary p-1"
        style={{ animationDelay: '0.04s' }}
        role="tablist"
        aria-label="表示切替"
      >
        {(
          [
            { key: 'list', label: 'リスト表示', icon: List },
            { key: 'calendar', label: 'カレンダー表示', icon: CalendarDays },
          ] as const
        ).map((v) => {
          const selected = v.key === mode
          const Icon = v.icon
          return (
            <button
              key={v.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setMode(v.key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-bold transition-all ${
                selected
                  ? 'bg-card text-matcha shadow-sm'
                  : 'text-muted-foreground'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {v.label}
            </button>
          )
        })}
      </div>

      {/* add task form */}
      <section
        className="animate-rise-in rounded-3xl bg-card p-4 shadow-sm"
        style={{ animationDelay: '0.08s' }}
        aria-label="タスクを追加"
      >
        <div className="flex items-center gap-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) addTask()
            }}
            placeholder="新しいタスクを入力..."
            aria-label="新しいタスク"
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/60"
          />
          <button
            type="button"
            onClick={addTask}
            disabled={!newTitle.trim()}
            aria-label="タスクを追加"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-matcha text-primary-foreground shadow-sm shadow-matcha/30 transition-transform active:scale-90 disabled:opacity-40"
          >
            <Plus className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {tagOptions.map((tag) => {
            const selected = tag === newTag
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setNewTag(tag)}
                aria-pressed={selected}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-all active:scale-95 ${
                  selected ? 'bg-matcha text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}
              >
                {tag}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setPickerOpen((v) => !v)}
            className="ml-auto flex items-center gap-1 rounded-full bg-yuzu/25 px-3 py-1 text-xs font-bold text-yuzu-foreground transition-transform active:scale-95"
          >
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(newDate)}
          </button>
        </div>

        {/* DatePicker popup */}
        {pickerOpen && (
          <div className="animate-pop-in mt-3 rounded-2xl border border-border bg-background p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">
                期限を選択
              </span>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                aria-label="閉じる"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-muted-foreground active:scale-90"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <MonthCalendar
              selected={newDate}
              onSelect={(iso) => {
                setNewDate(iso)
                setPickerOpen(false)
              }}
              marked={marked}
              compact
            />
          </div>
        )}
      </section>

      {mode === 'list' ? (
        <>
          {/* category filter */}
          <div
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1"
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

          <ul className="flex flex-col gap-2.5">
            {listVisible.map((task, i) => renderTaskCard(task, i))}
            {listVisible.length === 0 && (
              <li className="rounded-3xl bg-card p-8 text-center text-sm text-muted-foreground shadow-sm">
                このカテゴリのタスクはありません🌿
              </li>
            )}
          </ul>
        </>
      ) : (
        <>
          {/* calendar */}
          <section className="animate-rise-in rounded-3xl bg-card p-4 shadow-sm">
            <MonthCalendar
              selected={selectedDate}
              onSelect={setSelectedDate}
              marked={marked}
            />
          </section>

          <h3 className="px-1 font-rounded text-sm font-black text-foreground">
            {formatDate(selectedDate)} のタスク
          </h3>
          <ul className="flex flex-col gap-2.5">
            {calendarVisible.map((task, i) => renderTaskCard(task, i))}
            {calendarVisible.length === 0 && (
              <li className="rounded-3xl bg-card p-8 text-center text-sm text-muted-foreground shadow-sm">
                この日のタスクはありません🌿
              </li>
            )}
          </ul>
        </>
      )}
    </div>
  )
}
