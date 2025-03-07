import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ size = "md", variant = "primary", className = "", fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', width: '100%' }}>
        <Spinner animation="border" role="status" variant={variant} size={size}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Spinner animation="border" role="status" variant={variant} size={size} className={className}>
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
};

export default LoadingSpinner;