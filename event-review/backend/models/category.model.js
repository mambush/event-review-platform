const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Event = require('./event.model');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true
});

// Define EventCategory junction table
const EventCategory = sequelize.define('EventCategory', {}, { timestamps: false });

// Setup many-to-many relationship
Category.belongsToMany(Event, { through: EventCategory });
Event.belongsToMany(Category, { through: EventCategory });

module.exports = {
  Category,
  EventCategory
};