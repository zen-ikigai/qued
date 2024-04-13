import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Loading from '../info/Loading'

const withoutAuth = WrappedComponent => {
  const Wrapper = props => {
    const { data: session, status } = useSession()
    const router = useRouter()

    // Check if there is an active session, otherwise redirect to the login page
    useEffect(() => {
      if (status === 'loading') return
      if (status === 'authenticated') {
        router.push('/dashboard')
      }
    }, [status, router])

    if (status === 'loading') {
      return <Loading />
    }
    return session ? null : <WrappedComponent {...props} />
  }

  return Wrapper
}

export default withoutAuth
