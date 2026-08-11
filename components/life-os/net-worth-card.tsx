import { TrendingUp, Sprout } from 'lucide-react'

interface NetWorthCardProps {
  amount: number
  changePercent: number
}

export function NetWorthCard({ amount, changePercent }: NetWorthCardProps) {
  const positive = changePercent >= 0

  return (
    <section
      className="animate-rise-in relative overflow-hidden rounded-3xl p-6 text-primary-foreground shadow-lg shadow-matcha/25"
      style={{
        background:
          'linear-gradient(135deg, #748b47 0%, #5b7039 55%, #46572c 100%)',
      }}
      aria-label="純資産サマリー"
    >
      {/* decorative soft glow */}
      <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10 blur-xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-yuzu/15 blur-xl" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
            <Sprout className="h-4 w-4" aria-hidden="true" />
          </span>
          <p className="text-sm font-medium text-primary-foreground/80">
            純資産（BS）
          </p>
        </div>

        <span
          className="animate-pop-in inline-flex items-center gap-1 rounded-full bg-yuzu px-3 py-1 text-xs font-bold text-yuzu-foreground shadow-sm"
          style={{ animationDelay: '0.35s' }}
        >
          <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
          前月比 {positive ? '+' : ''}
          {changePercent.toFixed(1)}%
        </span>
      </div>

      <div className="relative mt-5">
        <p className="text-xs font-medium tracking-wide text-primary-foreground/70">
          現在の純資産
        </p>
        <p className="font-rounded mt-1 text-4xl font-black tracking-tight tabular-nums">
          ¥{amount.toLocaleString('ja-JP')}
        </p>
      </div>

      <div className="relative mt-5 flex gap-2">
        <MiniStat label="資産" value="¥4,820,000" />
        <MiniStat label="負債" value="¥1,470,000" />
      </div>
    </section>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 rounded-2xl bg-white/10 px-3 py-2 backdrop-blur-sm">
      <p className="text-[11px] font-medium text-primary-foreground/70">
        {label}
      </p>
      <p className="text-sm font-bold tabular-nums">{value}</p>
    </div>
  )
}
