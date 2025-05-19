const repo = require("../repositories/queueRepository");

const getAllQueues = () => repo.getAllQueues();
const getQueueById = (id) => repo.getQueueById(id);
const createQueue = (queue) => repo.createQueue(queue);
const updateQueue = (id, queue) => repo.updateQueue(id, queue);
const deleteQueue = (id) => repo.deleteQueue(id);
const addUserToQueue = (queueId, userId) => repo.addUserToQueue(queueId, userId);
const getUserPosition = (queueId, userId) => repo.getUserPosition(queueId, userId);
const removeUserFromQueue = (queueId, userId) => repo.removeUserFromQueue(queueId, userId);
const removeFirstUser = (queueId) => repo.removeFirstUser(queueId);
const closeQueue = (queueId) => repo.closeQueue(queueId);
module.exports = {
  getAllQueues,
  getQueueById,
  createQueue,
  updateQueue,
  deleteQueue,
  addUserToQueue,
  getUserPosition,
  removeUserFromQueue,
  removeFirstUser,
  closeQueue,
};