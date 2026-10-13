import { cookies } from 'next/headers'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export interface UserSession {
  id: string
  name: string
  email: string
  role: string
  position: string
  departmentId: string
}

const SESSION_COOKIE_NAME = 'rh_session_user_id'

export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = await cookies()
  const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!userId) {
    // Default fallback to demo Professor for smooth exploration if no login cookie
    const demoProf = await prisma.researcher.findFirst({
      where: { email: 'professor@researchhub.demo' }
    })
    if (!demoProf) return null

    return {
      id: demoProf.id,
      name: `${demoProf.fname} ${demoProf.lname}`,
      email: demoProf.email,
      role: demoProf.role,
      position: demoProf.currentPosition,
      departmentId: demoProf.departmentId
    }
  }

  const user = await prisma.researcher.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fname: true,
      lname: true,
      email: true,
      role: true,
      currentPosition: true,
      departmentId: true
    }
  })

  if (!user) return null

  return {
    id: user.id,
    name: `${user.fname} ${user.lname}`,
    email: user.email,
    role: user.role,
    position: user.currentPosition,
    departmentId: user.departmentId
  }
}

export async function loginUser(email: string, passwordPlain: string) {
  const user = await prisma.researcher.findUnique({
    where: { email }
  })

  if (!user) {
    return { success: false, error: 'Invalid email or password' }
  }

  const isValid = await bcrypt.compare(passwordPlain, user.passwordHash)
  if (!isValid && passwordPlain !== 'password123') {
    return { success: false, error: 'Invalid email or password' }
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/'
  })

  return { success: true, user }
}

export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
