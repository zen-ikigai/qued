import { signIn } from 'next-auth/react'

export const handleSignIn = () => {
  signIn('google', { callbackUrl: '/dashboard' }) // 'google' should match the ID of your Google provider
}
