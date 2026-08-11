'use client'

import { useState } from 'react'
import { Sparkles, TrendingUp, PiggyBank, Target, Send } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Suggestion {
  icon: LucideIcon
  title: string
  body: string
  color: string
  bg: string
}

const suggestions: Suggestion[] = [
  {
    icon: TrendingUp,
    title: '投資比率をもう5%',
    body: '投資が30%まで成長中🌱 ごほうび予算を少し回すと、来年の純資産が約¥180,000上振れる見込みです。',
    color: 'var(--matcha)',
    bg: 'var(--matcha-light)',
  },
  {
    icon: PiggyBank,
    title: '浪費に上限を設定',
    body: '浪費が先月比+8%。月¥50,000のごほうび枠を決めると、我慢せず気持ちよく使えますよ🍰',
    color: 'var(--sakura-foreground)',
    bg: 'var(--sakura)',
  },
  {
    icon: Target,
    title: '固定費の見直し',
    body: '通信費が平均より高めです。プラン変更で月¥3,200、年¥38,400の節約チャンス🍋',
    color: 'var(--yuzu-foreground)',
    bg: 'var(--yuzu)',
  },
]

const chips = ['今月の振り返り', '節約のコツ', '投資の始め方']

export function AIScreen() {
  const [message, setMessage] = useState('')

  return (
    <div className="flex flex-col gap-4">
      {/* diagnostic report */}
      <section
        className="animate-rise-in rounded-3xl p-[2px] shadow-sm"
        style={{
          background:
            'linear-gradient(120deg, #748b47, #f4c430 45%, #f4a7b9 80%, #748b47)',
        }}
        aria-label="AI顧問 抹茶さんの診断レポート"
      >
        <div className="rounded-[calc(1.5rem-2px)] bg-card p-5">
          <div className="flex items-center gap-3">
            <span className="animate-float-bob flex h-12 w-12 items-center justify-center rounded-full bg-matcha/10 text-2xl">
              🍵
            </span>
            <div>
              <h2 className="font-rounded text-base font-black text-foreground">
                AI顧問 抹茶さん
              </h2>
              <p className="text-[11px] font-medium text-muted-foreground">
                今週の経営診断レポート
              </p>
            </div>
            <span className="ml-auto rounded-full bg-matcha px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
              健全度 82
            </span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-foreground/85">
            今週もお疲れさまでした🌱 純資産は
            <span className="font-bold text-matcha">前月比+4.2%</span>
            と順調に成長しています。タスク達成率も高く、行動が数字に表れていますね。次の一手として、下の3つを見直すとさらに伸びますよ。
          </p>
        </div>
      </section>

      {/* improvement suggestions */}
      <div className="flex flex-col gap-3">
        <h3 className="font-rounded px-1 text-sm font-bold text-foreground">
          今週の改善提案
        </h3>
        {suggestions.map((s, i) => {
          const Icon = s.icon
          return (
            <article
              key={s.title}
              className="animate-rise-in flex gap-3 rounded-3xl bg-card p-4 shadow-sm"
              style={{ animationDelay: `${0.08 + i * 0.08}s` }}
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${s.bg}33`, color: s.color }}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h4 className="font-rounded text-sm font-bold text-foreground">
                  {s.title}
                </h4>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            </article>
          )
        })}
      </div>

      {/* chat input */}
      <div className="sticky bottom-0 -mx-4 mt-1 bg-gradient-to-t from-background via-background to-transparent px-4 pb-1 pt-3">
        <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setMessage(c)}
              className="shrink-0 rounded-full bg-card px-3 py-1.5 text-xs font-bold text-matcha shadow-sm transition-transform active:scale-95"
            >
              {c}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setMessage('')
          }}
          className="flex items-center gap-2 rounded-full border border-border/60 bg-card p-1.5 pl-4 shadow-lg shadow-matcha/10"
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="抹茶さんに相談する…"
            aria-label="メッセージを入力"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            aria-label="送信"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-matcha text-primary-foreground transition-transform active:scale-90 disabled:opacity-40"
          >
            <Send className="h-4.5 w-4.5" strokeWidth={2.5} aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  )
}
