const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  display_name: {
    type: DataTypes.STRING,
    defaultValue: 'Researcher'
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  google_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  microsoft_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  faculty: {
    type: DataTypes.STRING,
    defaultValue: 'General'
  },
  avatar_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    defaultValue: ''
  }
});

module.exports = User;
