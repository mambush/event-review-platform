import { useState } from 'react';
import axios from 'axios';

const CalendarIntegration = ({ eventId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleCalendar = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/calendar/google/${eventId}`);
      window.open(response.data.url, '_blank'); // Open Google Calendar link
    } catch (error) {
      setError('Failed to integrate with Google Calendar.');
      console.error('Google Calendar integration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOutlookCalendar = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/calendar/outlook/${eventId}`);
      window.open(response.data.url, '_blank'); // Open Outlook Calendar link
    } catch (error) {
      setError('Failed to integrate with Outlook Calendar.');
      console.error('Outlook Calendar integration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add to Calendar</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="d-flex gap-3">
        <button
          className="btn btn-primary"
          onClick={handleGoogleCalendar}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Add to Google Calendar'}
        </button>
        <button
          className="btn btn-primary"
          onClick={handleOutlookCalendar}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Add to Outlook Calendar'}
        </button>
      </div>
    </div>
  );
};

export default CalendarIntegration;