const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Events',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  overallRating: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  organizationRating: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  contentRating: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  venueRating: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  valueRating: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 100]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  pros: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cons: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  isVerifiedAttendee: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sentiment: {
    type: DataTypes.ENUM('positive', 'neutral', 'negative'),
    allowNull: true
  },
  aiSummary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  helpfulCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  reportCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['eventId'],
      name: 'review_event_idx'
    },
    {
      fields: ['userId'],
      name: 'review_user_idx'
    },
    {
      fields: ['overallRating'],
      name: 'review_rating_idx'
    },
    {
      fields: ['sentiment'],
      name: 'review_sentiment_idx'
    }
  ]
});

module.exports = Review;