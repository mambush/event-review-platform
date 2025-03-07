import { useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from '../common/EventCard';
import LoadingSpinner from '../common/LoadingSpinner';

const RecommendedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/recommendations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Failed to fetch recommended events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendedEvents();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Recommended Events</h2>
      {events.length === 0 ? (
        <p>No recommendations available at the moment.</p>
      ) : (
        <div className="row">
          {events.map((event) => (
            <div key={event.id} className="col-md-4 mb-4">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedEvents;