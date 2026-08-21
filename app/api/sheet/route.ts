import { NextResponse } from 'next/server'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, data } = body

    let sheetId = process.env.GOOGLE_SHEET_ID || ''
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    let privateKey = process.env.GOOGLE_PRIVATE_KEY

    if (!sheetId || !clientEmail || !privateKey) {
      return NextResponse.json({ error: '環境変数が未設定です' }, { status: 500 })
    }

    // URL全体が入力されている場合、IDの英数字だけを自動抽出
    const match = sheetId.match(/\/d\/([a-zA-Z0-9-_]+)/)
    if (match) {
      sheetId = match[1]
    }

    // Vercelでの改行コードと引用符の自動クリーニング
    privateKey = privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n')

    const serviceAccountAuth = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth)
    await doc.loadInfo()

    if (action === 'addTransaction') {
      // 'PL_Logs' タブ、なければ一番目のシートを自動選択
      let sheet = doc.sheetsByTitle['PL_Logs'] || doc.sheetsByIndex[0]

      if (sheet) {
        await sheet.addRow({
          '日付': data.date || new Date().toISOString().split('T')[0],
          '区分': data.type,
          'カテゴリ': data.category,
          '金額': data.amount,
          '貯金目的': data.savingsGoal || '',
          '決済方法': data.paymentMethod || 'アプリ入力',
          'メモ': data.memo || ''
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Sheet API Error:', error)
    return NextResponse.json({ error: error.message || 'スプレッドシート連携エラー' }, { status: 500 })
  }
}