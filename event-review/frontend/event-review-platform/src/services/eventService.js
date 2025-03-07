import api from './api';

export const getTrendingEvents = async () => {
    try {
      // Implementation details - perhaps fetching trending events from your API
      const response = await fetch('/api/events/trending');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching trending events:', error);
      throw error;
    }
  };