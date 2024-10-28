import { prisma } from './database.server'
import { compare } from 'bcryptjs'
import {
  createCookieSessionStorage,
  redirect,
  TypedResponse,
} from '@remix-run/node'

const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
  throw new Error('SESSION_SECRET is not defined')
}

const sessionStorage = createCookieSessionStorage({
  cookie: {
    secure: false,
    secrets: [sessionSecret],
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60,
    httpOnly: true,
  },
})

async function createUserSession(userId: string, redirectPath: string) {
  const session = await sessionStorage.getSession()
  session.set('userId', userId)

  return redirect(redirectPath, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  })
}

interface LoginInput {
  username: string
  password: string
}

class LoginError extends Error {
  data?: string
  status?: number

  constructor(data: string, status?: number) {
    super()
    this.data = data
    this.status = status
  }
}

export async function login({
  username,
  password,
}: LoginInput): Promise<TypedResponse<never>> {
  const existingUser = await prisma.user.findFirst({ where: { username } })

  if (!existingUser) {
    throw new LoginError('Invalid username', 401)
  }

  const passwordCorrect = await compare(password, existingUser.password)

  if (!passwordCorrect) {
    throw new LoginError('Invalid password', 401)
  }

  return createUserSession(existingUser.id, '/')
}

export async function getUserFromSession(
  request: Request,
): Promise<string | null> {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'))
  const userId = session.get('userId') as string | undefined
  return userId || null
}

export async function destroyUserSession(request: Request): Promise<Response> {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'))
  return redirect('/login', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  })
}

export async function requireUserSession(request: Request): Promise<string> {
  const userId = await getUserFromSession(request)

  if (!userId) {
    throw redirect('/login')
  }

  return userId
}

export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
      },
    })

    return user
  } catch (error) {
    return null
  }
}
