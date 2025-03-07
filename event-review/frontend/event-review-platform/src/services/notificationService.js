import api from './api';

// Export individual functions
export const getNotifications = async (userId) => {
  try {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAllAsRead = async (userId) => {
  try {
    const response = await api.put(`/notifications/user/${userId}/read-all`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    await api.delete(`/notifications/${notificationId}`);
    return true;
  } catch (error) {
    throw error;
  }
};

// Add default export that includes all functions
const notificationService = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};

export default notificationService;