const { Sequelize } = require('sequelize');
const { getDatabaseUrl } = require('./databaseUrl');
const url = getDatabaseUrl();

const sequelize = new Sequelize(url, { logging: false });

sequelize
  .authenticate()
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Database connection error:', err));

module.exports = sequelize;
