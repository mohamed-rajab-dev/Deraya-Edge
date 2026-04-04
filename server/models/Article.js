const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');

const Article = sequelize.define('Article', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  faculty: {
    type: DataTypes.STRING,
    allowNull: false
  },
  read_time: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  views_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tags: {
    type: DataTypes.STRING, // Store as a comma-separated string or JSON
    allowNull: true
  }
});

User.hasMany(Article, { foreignKey: 'user_id' });
Article.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Article;
