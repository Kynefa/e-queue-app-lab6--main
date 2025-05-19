const repo = require('../repositories/queueRepository');

exports.index = async (req, res) => {
  const queues = await repo.getAllQueues();
  res.render('index', { queues });
};

exports.createQueue = async (req, res) => {
  const { name, ownerId } = req.body;
  await repo.createQueue({ name, ownerId, isOpen: true  });
  res.redirect('/');
};

exports.addUser = async (req, res) => {
  const { queueId, userId } = req.body;
  await repo.addUserToQueue(queueId, userId);
  res.redirect('/');
};

exports.getUserPosition = async (req, res) => {
  const { queueId, userId } = req.body;
  const position = await repo.getUserPosition(queueId, userId);
  res.send(`Ваше місце в черзі: ${position}`); 
};

exports.removeFirst = async (req, res) => {
  const { ownerId } = req.body;
  const queues = await repo.getAllQueues();
  const queue = queues.find(q => q.ownerId == ownerId);
  if (queue) {
    await repo.removeFirstUser(queue.id);
  }с
  res.redirect('/');
};

exports.removeUser = async (req, res) => {
  const { ownerId, userId } = req.body;
  const queues = await repo.getAllQueues();
  const queue = queues.find(q => q.ownerId == ownerId);
  if (queue) {
    await repo.removeUser(queue.id, userId);
  }
  res.redirect('/');
};

exports.closeQueue = async (req, res) => {
  const { ownerId } = req.body;
  const queues = await repo.getAllQueues();
  const queue = queues.find(q => q.ownerId == ownerId);
  if (queue) {
    await repo.closeQueue(queue.id);
  }    
  res.redirect('/');
};
