'use client'
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

import { signOut } from "next-auth/react";
import Delete from '../info/deleteConfirmation';
import Success from '../info/Success';
import Failure from '../info/Failure';

const Profile = ({ tasks, setLoading }) => {
  
 
  const { data : session, status, update } = useSession();
  const completedTasksCount = tasks.filter(task => task.status === 'done').length;
  const ongoingTasksCount = tasks.filter(task => task.status === 'inProgress').length;
  
  const [deleteAllTasks, setDeleteAllTasks] = useState(false);
  const [deleteProfile, setDeleteProfile] = useState(false);
  const [successModalTasks, setSuccessModalTasks] = useState(false);
  const [failureModalTasks, setFailureModalTasks] = useState(false);
  const [failureModalProfile, setFailureModalProfile] = useState(false);
  

  const handleSignout = async() => {
    await signOut({callbackUrl: "/"});
  }

  const handleDeleteAllTasks = async () => {
    const userId = session?.user?.id; 
    setLoading(true);
    setDeleteAllTasks(false);
  
    try {
      const response = await fetch(`/api/user/${userId}/deletetasks`, {
        method: 'DELETE',
      });
  
      if(response.ok){
        setSuccessModalTasks(true);
        setLoading(false);
        update();
      } else {
        
        setFailureModalTasks(true);
        setLoading(false);
    }
      
    } catch (error) {
      setFailureModalTasks(true);
      setLoading(false);      
    }
  };
  
  const handleDeleteProfile = async () => {
    const userId = session?.user?.id; 
    setLoading(true);
    setDeleteProfile(false);
    try {
      
      const response = await fetch(`/api/user/${userId}/deleteprofile`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        
        handleSignout();
        setLoading(false);
        
        
    } else {
        
        setFailureModalProfile(true);
        setLoading(false);
    }
    } catch (error) {
      setFailureModalProfile(true);
      setLoading(false);
    }
  };
  
  

  return (
    <div className="profile-container min-w-[80vw] font-mono">
      <div className="flex items-center gap-4">
        <img src={`data:image/png;base64,${session?.user?.image}`} alt="Profile" className="profile-image" />
        <div>
          <h1 className="text-2xl">{session?.user.username}</h1>
          <p className="text-sm">{session?.user.email}</p>
        </div>
      </div>

      <div className="profile-stats flex sm:flex-row flex-col items-center justify-center ">
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

      <div className="profile-actions flex sm:flex-row flex-col items-center justify-center">
        <button className="delete-btn" onClick={() => setDeleteAllTasks(true)}>Delete All Tasks</button>
        {deleteAllTasks && (
          <Delete 
            title='Delete All Tasks'
            message='Are you sure you want to Delete all Tasks?'
            onClose={() => setDeleteAllTasks(false)}
            handleDelete={handleDeleteAllTasks}
          />
        )}
        {successModalTasks && (
        <Success
          title="Done"
          message="All Tasks Deleted Successfully"
          onClose={() => setSuccessModalTasks(false)}
        />
        )}
        {failureModalTasks && (
          <Failure
            title="Failed"
            message="Failed to delete all Tasks."
            onClose={() => setFailureModalTasks(false)}
          />
        )}
        
       
        <button className="delete-btn" onClick={() => setDeleteProfile(true)}>Delete Account</button>
        {deleteProfile && (
          <Delete 
            title='Delete Profile'
            message='Are you sure you want to Delete your Profile?'
            onClose={() => setDeleteProfile(false)}
            handleDelete={handleDeleteProfile}
          />
        )}
        {failureModalProfile && (
          <Failure
            title="Failed"
            message="Failed to delete Profile."
            onClose={() => setFailureModalProfile(false)}
          />
      )}
      </div>
      
    </div>
  );
};

export default Profile;
