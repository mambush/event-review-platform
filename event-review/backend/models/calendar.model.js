const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CalendarEvent = sequelize.define('CalendarEvent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Events',
      key: 'id'
    }
  },
  reminderTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notificationSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isAttending: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isSyncedWithExternalCalendar: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  externalCalendarType: {
    type: DataTypes.ENUM('google', 'outlook', 'apple', 'other'),
    allowNull: true
  },
  externalEventId: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['userId'],
      name: 'calendar_user_idx'
    },
    {
      fields: ['eventId'],
      name: 'calendar_event_idx'
    },
    {
      fields: ['reminderTime'],
      name: 'calendar_reminder_idx'
    }
  ]
});

module.exports = CalendarEvent;