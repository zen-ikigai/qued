'use client'
import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const Profile = ({ tasks }) => {
  // Dummy data
 
  const { data : session, status, update } = useSession();
  const completedTasksCount = tasks.filter(task => task.status === 'done').length;
  const ongoingTasksCount = tasks.filter(task => task.status === 'inProgress').length;
  const router = useRouter();

  const handleSignout = async() => {
    await signOut({callbackUrl: "/"});
  }

  const handleDeleteAllTasks = async () => {
    const userId = session?.user?.id; 
  
    try {
      const response = await fetch(`/api/user/${userId}/deletetasks`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete all tasks');
      }
      update();
      // Provide feedback to the user, maybe refresh the tasks or the page
    } catch (error) {
      console.error('Error deleting all tasks:', error);
      // Handle error (e.g., display an error message)
    }
  };
  
  const handleDeleteProfile = async () => {
    const userId = session?.user?.id; 
    try {
      handleSignout();
      const response = await fetch(`/api/user/${userId}/deleteprofile`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete profile');
      }
      router.push('/')
      // Log the user out or redirect them to a different page
    } catch (error) {
      console.error('Error deleting profile:', error);
      // Handle error (e.g., display an error message)
    }
  };
  
  

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={`data:image/png;base64,${session?.user?.image}`} alt="Profile" className="profile-image" />
        <h1 className="username">{session?.user.username}</h1>
        <p className="email">{session?.user.email}</p>
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-value">{session?.user.tasks.length}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{completedTasksCount}</span>
          <span className="stat-label">Tasks Completed</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{ongoingTasksCount}</span>
          <span className="stat-label">Tasks Ongoing</span>
        </div>
     
      </div>

      <div className="profile-actions">
        <button className="delete-btn" onClick={handleDeleteAllTasks}>Delete All Tasks</button>
        <button className="delete-btn" onClick={handleDeleteProfile}>Delete Account</button>
      </div>
    </div>
  );
};

export default Profile;
