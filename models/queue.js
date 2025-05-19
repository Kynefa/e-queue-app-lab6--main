'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Queue extends Model {
    static associate(models) {
      Queue.hasMany(models.User, { foreignKey: 'queueId', as: 'users' });
    }
  }

  Queue.init({
    name: DataTypes.STRING,
    ownerId: DataTypes.INTEGER,
    isOpen: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Queue',
  });

  return Queue;
};
