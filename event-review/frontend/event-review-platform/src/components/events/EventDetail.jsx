import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Failed to fetch event:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!event) {
    return <div>Event not found.</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <img src={event.image} className="card-img-top" alt={event.title} />
        <div className="card-body">
          <h2 className="card-title">{event.title}</h2>
          <p className="card-text">{event.description}</p>
          <p className="card-text">
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          </p>
          <p className="card-text">
            <strong>Location:</strong> {event.location}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;