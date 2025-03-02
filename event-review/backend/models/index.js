const User = require('./user.model');
const Event = require('./event.model');
const Review = require('./review.model');
const { Category, EventCategory } = require('./category.model');
const Calendar = require('./calendar.model');
const Notification = require('./notification.model');
const sequelize = require('../config/database');

// Export all models
module.exports = {
  User,
  Event,
  Review,
  Category,
  EventCategory,
  Calendar,
  Notification,
  sequelize
};