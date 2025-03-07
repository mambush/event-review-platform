import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReviewCard from '../common/ReviewCard';
import LoadingSpinner from '../common/LoadingSpinner';

const ReviewList = () => {
  const { eventId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/reviews/event/${eventId}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [eventId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to write one!</p>
      ) : (
        <div className="row">
          {reviews.map((review) => (
            <div key={review.id} className="col-md-6 mb-4">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;