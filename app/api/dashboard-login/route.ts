import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { password } = body

  if (password === process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
}