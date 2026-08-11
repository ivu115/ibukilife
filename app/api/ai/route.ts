import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY

    // APIキーがない場合のスマート代替応答
    if (!apiKey) {
      return NextResponse.json({
        reply: `「${message}」ですね！現在の純資産は¥${(context?.netWorth || 0).toLocaleString()}、今月の支出は¥${(context?.totalExpense || 0).toLocaleString()}です。焦らず1歩ずつ改善していきましょう！`
      })
    }

    const prompt = `あなたは「いぶきの人生経営」の専属AI顧問「抹茶さん 🍵」です。
ユーザーの現在のリアルタイム財務状況:
- 純資産: ¥${context?.netWorth || 0}
- 総資産: ¥${context?.assets || 0}
- 負債: ¥${context?.liabilities || 0}
- 今月の支出合計: ¥${context?.totalExpense || 0} (消費:¥${context?.consumption || 0}, 浪費:¥${context?.waste || 0}, 投資:¥${context?.investment || 0})

ユーザーからの質問・相談: 「${message}」

抹茶さんの設定:
- 親しみやすく、温かい和風・抹茶風の言葉遣い（「〜ですね」「〜してみましょう！」）
- CFO/COOとして、ユーザーの質問に財務データや人生経営の観点から短く的確に（2〜3文で）アドバイスを返してください。`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    )

    const data = await response.json()
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "申し訳ありません、アドバイスの生成に失敗しました。もう一度お試しください！"

    return NextResponse.json({ reply })
  } catch (error) {
    return NextResponse.json({ reply: "通信エラーが発生しました。時間を置いて再度お試しください。" })
  }
}