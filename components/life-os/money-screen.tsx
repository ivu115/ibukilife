'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

type Kind = '消費' | '浪費' | '投資'

const kinds: { key: Kind; color: string; emoji: string; hint: string }[] = [
  { key: '消費', color: 'var(--matcha-light)', emoji: '🍚', hint: '生活の土台' },
  { key: '浪費', color: 'var(--sakura)', emoji: '🍰', hint: 'ごほうび' },
  { key: '投資', color: 'var(--yuzu)', emoji: '🌱', hint: '未来の種まき' },
]

const categoryMap: Record<Kind, string[]> = {
  消費: ['食費', '住居', '光熱費', '通信', '日用品'],
  浪費: ['外食', '趣味', 'ファッション', 'カフェ'],
  投資: ['積立NISA', '株式', '書籍', 'スキル', '健康'],
}

const quickAmounts = [500, 1000, 3000, 5000, 10000]

export function MoneyScreen() {
  const [kind, setKind] = useState<Kind>('消費')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<string>('食費')

  const activeColor = kinds.find((k) => k.key === kind)?.color

  function selectKind(k: Kind) {
    setKind(k)
    setCategory(categoryMap[k][0])
  }

  function handleSubmit() {
    setAmount('')
    setKind('消費')
    setCategory('食費')
  }

  return (
    <div className="flex flex-col gap-4">
      {/* amount display */}
      <section
        className="animate-rise-in rounded-3xl bg-card p-6 text-center shadow-sm"
        aria-label="金額入力"
      >
        <p className="text-xs font-bold text-muted-foreground">今回の金額</p>
        <div className="mt-2 flex items-center justify-center">
          <span className="font-rounded text-3xl font-black text-matcha">¥</span>
          <input
            id="amount"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="0"
            value={amount ? Number(amount).toLocaleString('ja-JP') : ''}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
            aria-label="金額"
            className="font-rounded w-full min-w-0 bg-transparent text-center text-5xl font-black tabular-nums text-foreground outline-none placeholder:text-muted-foreground/40"
          />
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {quickAmounts.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setAmount((prev) => String((Number(prev) || 0) + q))}
              className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-matcha transition-transform active:scale-90"
            >
              +{q.toLocaleString('ja-JP')}
            </button>
          ))}
        </div>
      </section>

      {/* kind selector */}
      <section
        className="animate-rise-in rounded-3xl bg-card p-5 shadow-sm"
        style={{ animationDelay: '0.06s' }}
        aria-label="区分の選択"
      >
        <h2 className="font-rounded text-base font-bold text-foreground">区分</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {kinds.map((k) => {
            const selected = k.key === kind
            return (
              <button
                key={k.key}
                type="button"
                onClick={() => selectKind(k.key)}
                aria-pressed={selected}
                className={`rounded-2xl border-2 py-4 text-center transition-all active:scale-95 ${
                  selected ? 'shadow-sm' : 'border-transparent bg-secondary/60'
                }`}
                style={
                  selected
                    ? { borderColor: k.color, backgroundColor: `${k.color}22` }
                    : undefined
                }
              >
                <span className="block text-2xl">{k.emoji}</span>
                <span className="mt-1 block text-sm font-bold text-foreground">
                  {k.key}
                </span>
                <span className="mt-0.5 block text-[10px] text-muted-foreground">
                  {k.hint}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* category selector */}
      <section
        className="animate-rise-in rounded-3xl bg-card p-5 shadow-sm"
        style={{ animationDelay: '0.12s' }}
        aria-label="カテゴリの選択"
      >
        <h2 className="font-rounded text-base font-bold text-foreground">
          カテゴリ
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {categoryMap[kind].map((c) => {
            const selected = c === category
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={selected}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-all active:scale-95 ${
                  selected
                    ? 'text-primary-foreground shadow-sm'
                    : 'bg-secondary/60 text-foreground'
                }`}
                style={selected ? { backgroundColor: activeColor } : undefined}
              >
                {c}
              </button>
            )
          })}
        </div>
      </section>

      {/* submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!amount}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-matcha py-4 text-base font-bold text-primary-foreground shadow-lg shadow-matcha/30 transition-transform active:scale-[0.98] disabled:opacity-40"
      >
        <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
        記録する
      </button>
    </div>
  )
}
