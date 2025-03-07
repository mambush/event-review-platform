import { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import LoadingSpinner from '../common/LoadingSpinner';

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        const formattedEvents = response.data.map((event) => ({
          title: event.title,
          start: event.date,
          end: event.endDate || event.date, // Use endDate if available
          url: `/events/${event.id}`, // Link to event details
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Event Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        eventClick={(info) => {
          window.location.href = info.event.url; // Navigate to event details
        }}
      />
    </div>
  );
};

export default CalendarView;