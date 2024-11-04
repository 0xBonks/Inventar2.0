require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'inventory_management',
    host: process.env.DB_HOST || 'mysql',
    dialect: 'mysql',
    logging: false
  },
  test: {
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'inventory_management_test',
    host: process.env.DB_HOST || 'mysql',
    dialect: 'mysql',
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
}; 