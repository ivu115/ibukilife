import { NextResponse } from 'next/server'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, data } = body

    const sheetId = process.env.GOOGLE_SHEET_ID
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

    if (!sheetId || !clientEmail || !privateKey) {
      return NextResponse.json({ error: '環境変数が未設定です' }, { status: 500 })
    }

    const serviceAccountAuth = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth)
    await doc.loadInfo()

    if (action === 'addTransaction') {
      // PL_Logs タブへ追加
      const sheet = doc.sheetsByTitle['PL_Logs']
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}