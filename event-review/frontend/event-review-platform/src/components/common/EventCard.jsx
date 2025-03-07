// Import the first few lines of your EventCard component
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import calendarService from '../../services/calendarService';
// If you were using destructured imports, you could alternatively use:
// import { addToCalendar, removeFromCalendar, isEventInCalendar } from '../../services/calendarService';

// Then continue with your component code...
const EventCard = ({ event }) => {
  const { user } = useAuth();
  const [inCalendar, setInCalendar] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkIfInCalendar();
    }
  }, [user]);

  const checkIfInCalendar = async () => {
    if (!user) return;
    
    try {
      const isInCalendar = await calendarService.isEventInCalendar(user.id, event.id);
      setInCalendar(isInCalendar);
    } catch (error) {
      console.error("Error checking calendar:", error);
    }
  };

  const handleCalendarToggle = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (inCalendar) {
        await calendarService.removeFromCalendar(user.id, event.id);
        setInCalendar(false);
      } else {
        await calendarService.addToCalendar(user.id, event.id);
        setInCalendar(true);
      }
    } catch (error) {
      console.error("Error updating calendar:", error);
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component code...
};

export default EventCard;