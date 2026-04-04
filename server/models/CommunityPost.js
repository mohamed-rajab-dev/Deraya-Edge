const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');

const CommunityPost = sequelize.define('CommunityPost', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  faculty: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true
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
User.hasMany(CommunityPost, { foreignKey: 'user_id' });
CommunityPost.belongsTo(User, { foreignKey: 'user_id' });

module.exports = CommunityPost;
