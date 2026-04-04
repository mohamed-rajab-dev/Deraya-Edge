const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');

const ResearchPaper = sequelize.define('ResearchPaper', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  abstract: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  faculty: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file_url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pages: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  likes_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  comments_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

// Associations
User.hasMany(ResearchPaper, { foreignKey: 'user_id' });
ResearchPaper.belongsTo(User, { foreignKey: 'user_id' });

module.exports = ResearchPaper;
