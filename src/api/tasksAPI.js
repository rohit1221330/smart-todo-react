import apiClient from './apiClient';

/**
 * Authenticated user ke saare tasks fetch karta hai.
 */
export const getTasks = async () => {
  const response = await apiClient.get('/tasks/');
  return response.data;
};

/**
 * Naya task banata hai.
 */
export const addTask = async (taskData) => {
  const response = await apiClient.post('/tasks/', taskData);
  return response.data;
};

/**
 * Task ko update karta hai.
 */
export const updateTask = async (taskId, updates) => {
  // YAHAN CHANGE KIYA GAYA HAI
  const response = await apiClient.patch(`/tasks/${taskId}/`, updates);
  return response.data;
};

/**
 * Task ko delete karta hai.
 */
export const deleteTask = async (taskId) => {
  await apiClient.delete(`/tasks/${taskId}/`);
};