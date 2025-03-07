import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';

const ReviewAnalytics = () => {
  const { eventId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`/api/reviews/analytics/${eventId}`);
        setAnalytics(response.data);
      } catch (error) {
        console.error('Failed to fetch review analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [eventId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!analytics) {
    return <div>No analytics available.</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Review Analytics</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Average Rating</h5>
          <p className="card-text">{analytics.averageRating.toFixed(1)} / 5</p>
          <h5 className="card-title">Sentiment Analysis</h5>
          <p className="card-text">{analytics.sentiment}</p>
          <h5 className="card-title">Total Reviews</h5>
          <p className="card-text">{analytics.totalReviews}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewAnalytics;