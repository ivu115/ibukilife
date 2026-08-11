import { Sparkles } from 'lucide-react'

export function AIAdvisor() {
  return (
    <section
      className="animate-rise-in rounded-3xl p-[2px] shadow-sm"
      style={{
        animationDelay: '0.24s',
        background:
          'linear-gradient(120deg, #748b47, #f4c430 45%, #f4a7b9 80%, #748b47)',
      }}
      aria-label="今週の抹茶AIアドバイス"
    >
      <div className="rounded-[calc(1.5rem-2px)] bg-card p-5">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-matcha/10">
            <Sparkles className="h-4.5 w-4.5 text-matcha" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-rounded text-base font-bold text-foreground">
              今週の抹茶AIアドバイス
            </h2>
            <p className="text-[11px] font-medium text-muted-foreground">
              AI顧問があなたの経営を診断
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-foreground/85">
          投資比率が
          <span className="font-bold text-matcha">30%</span>
          まで伸びていて素晴らしい成長です🌱 一方で
          <span className="font-bold text-sakura-foreground">浪費</span>
          が先月比+8%。ごほうび予算を¥50,000に設定すると、純資産の伸びをさらに加速できますよ。
        </p>

        <button
          type="button"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-matcha px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm shadow-matcha/25 transition-transform active:scale-95"
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          詳しく相談する
        </button>
      </div>
    </section>
  )
}
