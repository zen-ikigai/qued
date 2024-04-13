/**
 * A higher-order component (HOC) designed to restrict access to a component if a user is authenticated.
 * It redirects authenticated users to the dashboard and shows the wrapped component only if the user is not authenticated.
 * It displays a loading spinner while the authentication status is being determined.
 *
 * @function withoutAuth
 * @param {React.ComponentType} WrappedComponent - The component to be conditionally displayed based on authentication.
 * @returns {React.ComponentType} - Returns null if the user is authenticated, otherwise returns the WrappedComponent.
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Loading from '../info/Loading'

const withoutAuth = WrappedComponent => {
  const Wrapper = props => {
    const { data: session, status } = useSession()
    const router = useRouter()

    // Redirect to dashboard if authenticated, halt any operation if the status is still loading.
    useEffect(() => {
      if (status === 'loading') return // Early return while authentication status is loading.
      if (status === 'authenticated') {
        router.push('/dashboard') // Redirect to the dashboard if authenticated.
      }
    }, [status, router])

    // Show loading screen while authentication status is being determined.
    if (status === 'loading') {
      return <Loading />
    }

    // Render null if the user is authenticated to prevent access to the WrappedComponent.
    // Render the WrappedComponent if the user is not authenticated.
    return session ? null : <WrappedComponent {...props} />
  }

  return Wrapper
}

export default withoutAuth
