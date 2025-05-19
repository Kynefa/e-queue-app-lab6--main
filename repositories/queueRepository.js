const { Queue, User, sequelize } = require('../models');

// Отримати всі черги з користувачами
async function getAllQueues() {
  return await Queue.findAll({ include: ['users'] });
}

// Отримати чергу за ID
async function getQueueById(id) {
  return await Queue.findByPk(id, { include: ['users'] });
}

// Створити нову чергу (транзакція)
async function createQueue(name, ownerId) {
  return await sequelize.transaction(async (t) => {
    return await Queue.create({
      name,
      ownerId,
      isOpen: true // ← додано!
    }, { transaction: t });
  });
}

// Оновити чергу (транзакція)
async function updateQueue(id, data) {
  return await sequelize.transaction(async (t) => {
    const queue = await Queue.findByPk(id, { transaction: t });
    if (!queue) throw new Error('Queue not found');
    return await queue.update(data, { transaction: t });
  });
}

// Видалити чергу (транзакція)
async function deleteQueue(id) {
  return await sequelize.transaction(async (t) => {
    await User.destroy({ where: { queueId: id }, transaction: t });
    return await Queue.destroy({ where: { id }, transaction: t });
  });
}

// Бізнес-операція: додати користувача до черги (з перевіркою і відкатом)
async function addUserToQueue(queueId, userId) {
  return await sequelize.transaction(async (t) => {
    const queue = await Queue.findByPk(queueId, { transaction: t });
    if (!queue || !queue.isOpen) throw new Error('Черга не знайдена або закрита');
    return await User.create({ queueId, userId }, { transaction: t });
  });
}

// Отримати позицію користувача в черзі
async function getUserPosition(queueId, userId) {
  const queue = await Queue.findByPk(queueId, {
    include: [{ model: User, as: 'users', order: [['createdAt', 'ASC']] }],
  });
  if (!queue) return null;
  const userIds = queue.users.map(u => u.userId);
  const position = userIds.indexOf(userId);
  return position >= 0 ? position + 1 : null;
}

// Видалити першого користувача з черги (транзакція)
async function removeFirstUser(queueId) {
  return await sequelize.transaction(async (t) => {
    const user = await User.findOne({
      where: { queueId },
      order: [['createdAt', 'ASC']],
      transaction: t,
    });
    if (user) await user.destroy({ transaction: t });
  });
}

// Видалити конкретного користувача з черги (транзакція)
async function removeUser(queueId, userId) {
  return await sequelize.transaction(async (t) => {
    await User.destroy({ where: { queueId, userId }, transaction: t });
  });
}

// Закрити чергу (транзакція)
async function closeQueue(queueId) {
  return await sequelize.transaction(async (t) => {
    const queue = await Queue.findByPk(queueId, { transaction: t });
    if (queue) await queue.update({ isOpen: false }, { transaction: t });
  });
}

module.exports = {
  getAllQueues,
  getQueueById,
  createQueue,
  updateQueue,
  deleteQueue,
  addUserToQueue,
  getUserPosition,
  removeFirstUser,
  removeUser,
  closeQueue,
};