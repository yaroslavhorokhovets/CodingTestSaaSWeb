import { DefaultSession } from 'next-auth'
import { AuthUser } from './index'

declare module 'next-auth' {
  interface Session {
    user: AuthUser
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: AuthUser
  }
}