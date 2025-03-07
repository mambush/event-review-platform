import api from './api';

// Export individual functions
export const addToCalendar = async (userId, eventId) => {
  try {
    const response = await api.post('/calendar/add', { userId, eventId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeFromCalendar = async (userId, eventId) => {
  try {
    const response = await api.delete(`/calendar/remove`, { 
      data: { userId, eventId } 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserEvents = async (userId) => {
  try {
    const response = await api.get(`/calendar/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const isEventInCalendar = async (userId, eventId) => {
  try {
    const response = await api.get(`/calendar/check`, {
      params: { userId, eventId }
    });
    return response.data.isInCalendar;
  } catch (error) {
    return false;
  }
};

export const exportToGoogleCalendar = async (eventId) => {
  try {
    const response = await api.get(`/calendar/export/google/${eventId}`);
    return response.data.url;
  } catch (error) {
    throw error;
  }
};

export const exportToOutlookCalendar = async (eventId) => {
  try {
    const response = await api.get(`/calendar/export/outlook/${eventId}`);
    return response.data.url;
  } catch (error) {
    throw error;
  }
};

// Add default export that includes all functions
const calendarService = {
  addToCalendar,
  removeFromCalendar,
  getUserEvents,
  isEventInCalendar,
  exportToGoogleCalendar,
  exportToOutlookCalendar
};

export default calendarService;