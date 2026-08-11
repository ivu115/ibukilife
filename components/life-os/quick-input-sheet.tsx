'use client'

import { useEffect, useState } from 'react'
import { X, Check } from 'lucide-react'

type Kind = '消費' | '浪費' | '投資'

const kinds: { key: Kind; color: string; emoji: string }[] = [
  { key: '消費', color: 'var(--matcha-light)', emoji: '🍚' },
  { key: '浪費', color: 'var(--sakura)', emoji: '🍰' },
  { key: '投資', color: 'var(--yuzu)', emoji: '🌱' },
]

const quickAmounts = [500, 1000, 3000, 5000, 10000]

export function QuickInputSheet({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [kind, setKind] = useState<Kind>('消費')
  const [amount, setAmount] = useState('')

  // lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [open])

  function reset() {
    setAmount('')
    setKind('消費')
  }

  function handleSave() {
    // demo only — reset and close
    reset()
    onClose()
  }

  return (
    <div
      className={`fixed inset-0 z-50 mx-auto max-w-[430px] ${
        open ? '' : 'pointer-events-none'
      }`}
      aria-hidden={!open}
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="閉じる"
        onClick={onClose}
        className={`absolute inset-0 bg-matcha-dark/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="爆速収支入力"
        className={`absolute inset-x-0 bottom-0 rounded-t-[2rem] bg-card p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />

        <div className="flex items-center justify-between">
          <h2 className="font-rounded text-lg font-bold text-foreground">
            爆速収支入力 ⚡
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-transform active:scale-90"
          >
            <X className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
        </div>

        {/* kind selector */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {kinds.map((k) => {
            const selected = k.key === kind
            return (
              <button
                key={k.key}
                type="button"
                onClick={() => setKind(k.key)}
                className={`rounded-2xl border-2 py-3 text-center transition-all active:scale-95 ${
                  selected ? 'shadow-sm' : 'border-transparent bg-secondary/60'
                }`}
                style={
                  selected
                    ? { borderColor: k.color, backgroundColor: `${k.color}22` }
                    : undefined
                }
                aria-pressed={selected}
              >
                <span className="block text-2xl">{k.emoji}</span>
                <span className="mt-1 block text-sm font-bold text-foreground">
                  {k.key}
                </span>
              </button>
            )
          })}
        </div>

        {/* amount */}
        <div className="mt-5">
          <label
            htmlFor="amount"
            className="text-xs font-bold text-muted-foreground"
          >
            金額
          </label>
          <div className="mt-1.5 flex items-center rounded-2xl bg-secondary/60 px-4 focus-within:ring-2 focus-within:ring-matcha">
            <span className="font-rounded text-2xl font-black text-matcha">
              ¥
            </span>
            <input
              id="amount"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
              className="font-rounded w-full bg-transparent py-3 pl-2 text-2xl font-black tabular-nums text-foreground outline-none placeholder:text-muted-foreground/50"
            />
          </div>

          {/* quick amount pills */}
          <div className="mt-3 flex flex-wrap gap-2">
            {quickAmounts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() =>
                  setAmount((prev) => String((Number(prev) || 0) + q))
                }
                className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-matcha transition-transform active:scale-90"
              >
                +{q.toLocaleString('ja-JP')}
              </button>
            ))}
          </div>
        </div>

        {/* save */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!amount}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-matcha py-4 text-base font-bold text-primary-foreground shadow-lg shadow-matcha/30 transition-transform active:scale-[0.98] disabled:opacity-40"
        >
          <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
          記録する
        </button>
      </div>
    </div>
  )
}
