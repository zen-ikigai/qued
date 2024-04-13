/**
 * ProfilePage component that displays the user profile and associated tasks.
 * It fetches tasks specific to the logged-in user and handles loading states.
 * This component is protected by `withAuth` to ensure it is accessible only to authenticated users.
 *
 * @component
 * @example
 * return <ProfilePage />
 */

'use client'
import React, { useEffect, useState } from 'react'
import Profile from '@/components/user/Profile'
import { useSession } from 'next-auth/react'
import Loading from '@/components/info/Loading'
import withAuth from '@/components/hoc/withAuth'

const ProfilePage = () => {
  const { data: session, status, update } = useSession()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)

  /**
   * Fetches tasks associated with the current user.
   * Updates the `tasks` state with the fetched data.
   */
  const fetchTasks = async () => {
    const response = await fetch(`/api/user/${session?.user.id}/gettasks`, {
      method: 'GET',
    })
    if (response.ok) {
      const data = await response.json()
      setTasks(data)
    } else {
      console.error('Failed to fetch tasks:', await response.text())
      setLoading(false) // Ensure loading is false on failure to allow for retries or updates.
    }
  }

  /**
   * Effect hook to initiate task fetching on component mount or when the session updates.
   */
  useEffect(() => {
    if (session?.user) {
      setLoading(true)
      fetchTasks().finally(() => setLoading(false))
    }
  }, [session])

  /**
   * Renders a loading screen while data is being fetched or session is being established.
   */
  if (status === 'loading' || !session || loading) {
    return <Loading />
  }

  /**
   * Renders the user profile and passes down the tasks and a loader control function.
   */
  return <Profile tasks={tasks} setLoading={setLoading} />
}

export default withAuth(ProfilePage)
