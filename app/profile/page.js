'use client'
import React, { useEffect, useState } from 'react'
import Profile from '@/components/user/Profile'
import { useSession } from 'next-auth/react';
import Loading from '@/components/info/Loading';
import withAuth from '@/components/hoc/withAuth';

const ProfilePage = () => {
  const { data: session, status, update } = useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    const response = await fetch(`/api/user/${session?.user.id}/gettasks`, {
      method: 'GET'
    });
    const data = await response.json()
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, [session]);

  if (status === "loading" || !session || loading) {
    return (
      <Loading />
    )
  }

  return (
    <Profile tasks={tasks} setLoading={setLoading}/>
  )
}

export default withAuth(ProfilePage);