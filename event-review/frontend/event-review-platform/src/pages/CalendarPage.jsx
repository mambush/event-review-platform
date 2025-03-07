import React from 'react';
import CalendarView from '../components/calendar/CalendarView';

const CalendarPage = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center">Event Calendar</h1>
      <CalendarView />
    </div>
  );
};

export default CalendarPage;