const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DailyReport = sequelize.define('DailyReport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  work_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  weather: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  worker_count: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'daily_reports',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = DailyReport;
