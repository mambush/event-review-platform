const ReviewCard = ({ review }) => {
    return (
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">{review.user}</h5>
          <p className="card-text">{review.content}</p>
          <div className="text-muted">
            Rating: {review.rating}/5
          </div>
        </div>
      </div>
    );
  };
  
  export default ReviewCard;