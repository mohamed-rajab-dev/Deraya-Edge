const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');

const Course = sequelize.define('Course', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  faculty: {
    type: DataTypes.STRING,
    allowNull: false
  },
  instructor: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duration: {
    type: DataTypes.STRING,
    defaultValue: '4 weeks'
  },
  level: {
    type: DataTypes.STRING,
    defaultValue: 'Beginner'
  },
  enrolled_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

User.hasMany(Course, { foreignKey: 'user_id' });
Course.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Course;
