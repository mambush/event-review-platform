import api from './api';

export const getReviewsByEventId = async (eventId) => {
  try {
    return await api.get(`/reviews/event/${eventId}`);
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserReviews = async () => {
  try {
    return await api.get('/reviews/user');
  } catch (error) {
    throw new Error(error);
  }
};

export const createReview = async (reviewData) => {
  try {
    return await api.post('/reviews', reviewData);
  } catch (error) {
    throw new Error(error);
  }
};

export const updateReview = async (id, reviewData) => {
  try {
    return await api.put(`/reviews/${id}`, reviewData);
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteReview = async (id) => {
  try {
    return await api.delete(`/reviews/${id}`);
  } catch (error) {
    throw new Error(error);
  }
};

export const getReviewAnalytics = async (eventId) => {
  try {
    return await api.get(`/reviews/analytics/${eventId}`);
  } catch (error) {
    throw new Error(error);
  }
};