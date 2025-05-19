'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Queue, { foreignKey: 'queueId', as: 'queue' });
    }
  }

  User.init({
    userId: DataTypes.INTEGER,
    queueId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
