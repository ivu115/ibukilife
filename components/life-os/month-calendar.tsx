'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

export const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`

const todayISO = toISO(new Date())

export function MonthCalendar({
  selected,
  onSelect,
  marked,
  compact = false,
}: {
  selected: string
  onSelect: (iso: string) => void
  marked?: Record<string, number>
  compact?: boolean
}) {
  const base = selected ? new Date(selected) : new Date()
  const [view, setView] = useState({
    year: base.getFullYear(),
    month: base.getMonth(),
  })

  const firstDay = new Date(view.year, view.month, 1)
  const startOffset = firstDay.getDay()
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  function shift(delta: number) {
    setView((v) => {
      const m = v.month + delta
      const d = new Date(v.year, m, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  return (
    <div>
      {/* month header */}
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shift(-1)}
          aria-label="前の月"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-matcha transition-transform active:scale-90"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="font-rounded text-sm font-black text-foreground tabular-nums">
          {view.year}年 {view.month + 1}月
        </span>
        <button
          type="button"
          onClick={() => shift(1)}
          aria-label="次の月"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-matcha transition-transform active:scale-90"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* weekday labels */}
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((w, i) => (
          <span
            key={w}
            className={`py-1 text-center text-[10px] font-bold ${
              i === 0
                ? 'text-sakura-foreground'
                : i === 6
                  ? 'text-matcha'
                  : 'text-muted-foreground'
            }`}
          >
            {w}
          </span>
        ))}
      </div>

      {/* day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <span key={`e${i}`} />
          const iso = toISO(new Date(view.year, view.month, day))
          const isSelected = iso === selected
          const isToday = iso === todayISO
          const count = marked?.[iso] ?? 0
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelect(iso)}
              aria-pressed={isSelected}
              className={`relative flex flex-col items-center justify-center rounded-2xl text-sm font-bold tabular-nums transition-all active:scale-90 ${
                compact ? 'h-9' : 'h-11'
              } ${
                isSelected
                  ? 'bg-matcha text-primary-foreground shadow-sm shadow-matcha/30'
                  : isToday
                    ? 'bg-yuzu/25 text-foreground'
                    : 'text-foreground hover:bg-secondary'
              }`}
            >
              {day}
              {count > 0 && (
                <span
                  className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${
                    isSelected ? 'bg-yuzu' : 'bg-matcha'
                  }`}
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
