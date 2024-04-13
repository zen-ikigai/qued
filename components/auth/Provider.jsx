/**
 * Provider component that wraps the application with the NextAuth SessionProvider.
 * This setup is necessary to manage the authentication state throughout the application.
 * It takes a session object as a prop and provides it to all child components.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.session - The session object to be provided by NextAuth
 * @param {ReactNode} props.children - Child components that can consume the session context
 * @example
 * return (
 *   <Provider session={session}>
 *     <App />
 *   </Provider>
 * );
 */
'use client'
import { SessionProvider } from 'next-auth/react'

const Provider = ({ children, session }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>
}

export default Provider
