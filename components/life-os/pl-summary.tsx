interface Segment {
  label: string
  amount: number
  percent: number
  color: string
  hint: string
}

const segments: Segment[] = [
  { label: '消費', amount: 182000, percent: 52, color: 'var(--matcha-light)', hint: '生活の土台' },
  { label: '浪費', amount: 63000, percent: 18, color: 'var(--sakura)', hint: 'ごほうび' },
  { label: '投資', amount: 105000, percent: 30, color: 'var(--yuzu)', hint: '未来の種まき' },
]

export function PLSummary() {
  return (
    <section
      className="animate-rise-in rounded-3xl bg-card p-5 shadow-sm"
      style={{ animationDelay: '0.08s' }}
      aria-label="今月の収支サマリー"
    >
      <div className="flex items-baseline justify-between">
        <h2 className="font-rounded text-base font-bold text-foreground">
          今月の収支（PL）
        </h2>
        <span className="text-xs font-medium text-muted-foreground">
          支出 ¥350,000
        </span>
      </div>

      {/* combined progress bar */}
      <div className="mt-4 flex h-4 w-full overflow-hidden rounded-full bg-secondary">
        {segments.map((s, i) => (
          <div
            key={s.label}
            className="h-full origin-left first:rounded-l-full last:rounded-r-full"
            style={{
              width: `${s.percent}%`,
              backgroundColor: s.color,
              animation: `bar-grow 0.8s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.12}s both`,
            }}
          />
        ))}
      </div>

      <ul className="mt-4 grid grid-cols-3 gap-2">
        {segments.map((s) => (
          <li
            key={s.label}
            className="rounded-2xl bg-secondary/60 px-3 py-2.5 text-center"
          >
            <span className="flex items-center justify-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
                aria-hidden="true"
              />
              <span className="text-xs font-bold text-foreground">
                {s.label}
              </span>
            </span>
            <p className="font-rounded mt-1 text-lg font-black tabular-nums text-foreground">
              {s.percent}%
            </p>
            <p className="text-[11px] tabular-nums text-muted-foreground">
              ¥{s.amount.toLocaleString('ja-JP')}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
