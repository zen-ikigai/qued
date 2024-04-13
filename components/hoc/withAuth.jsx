/**
 * A higher-order component (HOC) that wraps a component and redirects the user to the home page if they are not authenticated. If the authentication status is still loading, it displays a loading spinner.
 *
 * @function withAuth
 * @param {React.ComponentType} WrappedComponent - The component to be wrapped by the authentication logic.
 * @returns {React.ComponentType} - A component that either renders the WrappedComponent if the user is authenticated, displays a loading spinner if authentication status is loading, or redirects to the home page if unauthenticated.
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Loading from '../info/Loading'

const withAuth = WrappedComponent => {
  /**
   * Wrapper component that utilizes session information from `next-auth` to manage authentication redirects and loading states.
   *
   * @component
   * @param {Object} props - Props to be passed to the WrappedComponent.
   * @returns {React.ReactElement|null} - The WrappedComponent if the user is authenticated, a Loading component if the authentication status is 'loading', or null if unauthenticated (which triggers a redirect).
   */
  const Wrapper = props => {
    const { data: session, status } = useSession()
    const router = useRouter()

    // Handle redirect to home page if not authenticated, show loading indicator while authentication status is pending.
    useEffect(() => {
      if (status === 'loading') return
      if (status === 'unauthenticated') {
        router.push('/')
      }
    }, [status, router])

    // Display loading component if the session status is 'loading'
    if (status === 'loading') {
      return <Loading />
    }

    // Render the WrappedComponent if the user is authenticated, otherwise render nothing which will redirect.
    return session ? <WrappedComponent {...props} /> : null
  }

  return Wrapper
}

export default withAuth
