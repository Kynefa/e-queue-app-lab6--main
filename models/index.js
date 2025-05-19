'use strict';
const Sequelize = require('sequelize');
const config = require(__dirname + '/../config/config.json')['development'];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const User = require('./user')(sequelize, Sequelize.DataTypes);
const Queue = require('./queue')(sequelize, Sequelize.DataTypes);

db.User = User;
db.Queue = Queue;

User.associate(db);
Queue.associate(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
