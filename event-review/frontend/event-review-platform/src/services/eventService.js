import api from './api';

// Your existing function
export const getEvents = async () => {
  const response = await api.get('/api/events');
  return response.data; // Make sure this is an array
};

// New functions to add
export const getUpcomingEvents = async () => {
  const response = await api.get('/api/events/upcoming');
  return response.data;
};

export const getAllEvents = async () => {
  const response = await api.get('/api/events');
  return response.data;
};

export const getEventById = async (id) => {
  const response = await api.get(`/api/events/${id}`);
  return response.data;
};

// Additional useful functions based on your project requirements
export const createEvent = async (eventData) => {
  const response = await api.post('/api/events', eventData);
  return response.data;
};

export const updateEvent = async (id, eventData) => {
  const response = await api.put(`/api/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await api.delete(`/api/events/${id}`);
  return response.data;
};

export const getEventsByCategory = async (categoryId) => {
  const response = await api.get(`/api/events/category/${categoryId}`);
  return response.data;
};

export const getEventReviews = async (eventId) => {
  const response = await api.get(`/api/reviews/event/${eventId}`);
  return response.data;
};