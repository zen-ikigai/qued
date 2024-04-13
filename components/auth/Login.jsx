/**
 * Triggers sign-in flow using the Google OAuth provider configured in NextAuth.
 * It redirects the user to the dashboard upon successful authentication.
 *
 * @function
 * @example
 * <button onClick={handleSignIn}>Login with Google</button>
 */
import { signIn } from 'next-auth/react'

export const handleSignIn = () => {
  signIn('google', { callbackUrl: '/dashboard' }) // 'google' should match the ID of your Google provider
}
