const sequelize = require('../config/database');
const User = require('./user.model');
const Event = require('./event.model');
const Review = require('./review.model');
const CalendarEvent = require('./calendar.model');

// User to Event relations
User.hasMany(Event, { foreignKey: 'createdBy', as: 'createdEvents' });
Event.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// User to Review relations
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Event to Review relations
Event.hasMany(Review, { foreignKey: 'eventId', as: 'reviews' });
Review.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

// User to CalendarEvent relations
User.hasMany(CalendarEvent, { foreignKey: 'userId', as: 'calendarEvents' });
CalendarEvent.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Event to CalendarEvent relations
Event.hasMany(CalendarEvent, { foreignKey: 'eventId', as: 'attendees' });
CalendarEvent.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

module.exports = {
  sequelize,
  User,
  Event,
  Review,
  CalendarEvent
};