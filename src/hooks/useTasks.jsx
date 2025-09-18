import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import * as tasksAPI from '../api/tasksAPI';
import { useAuth } from './useAuth';

const TasksContext = createContext(null);

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch tasks when user is authenticated
  useEffect(() => {
    if (user) {
      setLoading(true);
      tasksAPI.getTasks(user.id)
        .then(data => {
          setTasks(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      // Clear tasks if user logs out
      setTasks([]);
    }
  }, [user]);

  const addTask = async (taskData) => {
    if (!user) return;
    const newTaskData = { ...taskData, user: user.id };
    try {
      const newTask = await tasksAPI.addTask(newTaskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const updatedTask = await tasksAPI.updateTask(taskId, updates);
      setTasks(prevTasks => prevTasks.map(task => (task.id === taskId ? updatedTask : task)));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await tasksAPI.deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteCompletedTasks = async () => {
      const completedTasks = tasks.filter(task => task.status === 'completed');
      // Await all delete operations
      await Promise.all(completedTasks.map(task => tasksAPI.deleteTask(task.id)));
      // Update state once
      setTasks(prevTasks => prevTasks.filter(task => task.status !== 'completed'));
  };

  const markAllAsComplete = async () => {
      const pendingTasks = tasks.filter(task => task.status === 'pending');
      // Await all update operations
      const updatedTasks = await Promise.all(
        pendingTasks.map(task => tasksAPI.updateTask(task.id, { status: 'completed' }))
      );
      // Update state with the results
      setTasks(prevTasks => 
          prevTasks.map(task => {
              const updated = updatedTasks.find(u => u.id === task.id);
              return updated || task;
          })
      );
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);


  const value = {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    deleteCompletedTasks,
    markAllAsComplete,
    stats
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};

export const useTasks = () => {
  return useContext(TasksContext);
};