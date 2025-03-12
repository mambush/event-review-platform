const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Event = require('./Event');

const Calendar = sequelize.define('Calendar', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reminderEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  reminderTime: {
    type: DataTypes.INTEGER, // Minutes before event
    defaultValue: 60
  }
}, {
  timestamps: true
});

// Define relationships
Calendar.belongsTo(User, { foreignKey: 'userId' });
Calendar.belongsTo(Event, { foreignKey: 'eventId' });
User.hasMany(Calendar, { foreignKey: 'userId' });

module.exports = Calendar;