import React from 'react';
import EventList from '../components/events/EventList';

const EventsPage = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center">All Events</h1>
      <EventList />
    </div>
  );
};

export default EventsPage;