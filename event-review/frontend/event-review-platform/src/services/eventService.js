import axios from 'axios';

export const getUpcomingEvents = async () => {
  try {
    const response = await axios.get('/api/events');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch events:', error);
    throw error;
  }
};