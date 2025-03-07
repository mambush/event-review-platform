import React from 'react';
import { useParams } from 'react-router-dom';
import EventDetail from '../components/events/EventDetail';
import ReviewList from '../components/reviews/ReviewList';
import ReviewForm from '../components/reviews/ReviewForm';

const EventDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="container mt-5">
      <EventDetail />
      <h2 className="mt-5">Reviews</h2>
      <ReviewList eventId={id} />
      <h2 className="mt-5">Write a Review</h2>
      <ReviewForm eventId={id} />
    </div>
  );
};

// Ensure this is the default export
export default EventDetailPage;