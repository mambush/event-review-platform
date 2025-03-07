import notificationService from '../services/notificationService';
// You could alternatively use named imports:
// import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../services/notificationService';

import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await notificationService.getNotifications(user.id);
      setNotifications(data);
      countUnread(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const countUnread = (notifs) => {
    const count = notifs.filter(notif => !notif.read).length;
    setUnreadCount(count);
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    if (!user) return;
    
    try {
      await notificationService.markAllAsRead(user.id);
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const removeNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      const updatedNotifications = notifications.filter(
        notif => notif.id !== notificationId
      );
      setNotifications(updatedNotifications);
      countUnread(updatedNotifications);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead: markNotificationAsRead,
        markAllAsRead: markAllNotificationsAsRead,
        deleteNotification: removeNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};