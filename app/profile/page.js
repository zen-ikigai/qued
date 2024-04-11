'use client'
import React, { useEffect, useState } from 'react'
import Profile from '@/components/user/Profile'
import { useSession } from 'next-auth/react';

const ProfilePage = () => {
  const { data: session, status, update } = useSession();
  const [tasks, setTasks] = useState([]);


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

  return (
    <Profile tasks={tasks}/>
  )
}

export default ProfilePage