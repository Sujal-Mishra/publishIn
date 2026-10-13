import { NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const result = await loginUser(email, password)

    if (result.success) {
      return NextResponse.json({ success: true, user: result.user })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 401 })
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 })
  }
}
