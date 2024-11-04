const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sale = sequelize.define('Sale', {
  sale_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total_sale: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  customer: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Sale; 