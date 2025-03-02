const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');
const Event = require('./event.model');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  sentimentScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

// Define relationships
Review.belongsTo(User, { foreignKey: 'userId' });
Review.belongsTo(Event, { foreignKey: 'eventId' });
User.hasMany(Review, { foreignKey: 'userId' });
Event.hasMany(Review, { foreignKey: 'eventId' });

module.exports = Review;