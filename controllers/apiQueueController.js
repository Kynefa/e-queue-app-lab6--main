const { Queue, User } = require('../models');

exports.create = async (req, res) => {
  try {
    let { name, ownerId } = req.body;

    if (Array.isArray(name)) name = name[0];
    if (Array.isArray(ownerId)) ownerId = ownerId[0];

    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Поле name має бути непорожнім рядком' });
    }

    ownerId = parseInt(ownerId);
    if (isNaN(ownerId)) {
      return res.status(400).json({ error: 'Поле ownerId має бути числом' });
    }

    const queue = await Queue.create({ name, ownerId, isOpen: true });
    res.status(201).json(queue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const { name, page = 1, limit = 5 } = req.query;
    const where = {};
    if (name) where.name = name;

    const result = await Queue.findAndCountAll({
      where,
      include: [{ model: User, as: 'users' }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.status(200).json({
      data: result.rows,
      total: result.count,
      page: parseInt(page),
      totalPages: Math.ceil(result.count / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findById = async (req, res) => {
  try {
    const queue = await Queue.findByPk(req.params.id, {
      include: [{ model: User, as: 'users' }]
    });
    if (!queue) return res.status(404).json({ error: 'Queue not found' });
    res.status(200).json(queue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const queue = await Queue.findByPk(req.params.id);
    if (!queue) return res.status(404).json({ error: 'Queue not found' });

    await queue.update(req.body);
    res.status(200).json(queue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const queue = await Queue.findByPk(req.params.id);
    if (!queue) return res.status(404).json({ error: 'Queue not found' });

    await queue.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { queueId, userId } = req.body;
    if (!queueId || !userId) {
      return res.status(400).json({ error: 'queueId і userId обов’язкові' });
    }
    const queue = await Queue.findByPk(queueId);
    if (!queue || !queue.isOpen) {
      return res.status(400).json({ error: 'Черга не знайдена або закрита' });
    }
    const user = await User.create({ queueId, userId });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserPosition = async (req, res) => {
  try {
    const { queueId, userId } = req.query;
    if (!queueId || !userId) {
      return res.status(400).json({ error: 'queueId і userId обов’язкові' });
    }
    const queue = await Queue.findByPk(queueId, {
      include: [{ model: User, as: 'users', order: [['createdAt', 'ASC']] }]
    });
    if (!queue) return res.status(404).json({ error: 'Queue not found' });

    const userIds = queue.users.map(u => parseInt(u.userId));
    const position = userIds.indexOf(parseInt(userId));
    if (position === -1) {
      return res.status(404).json({ error: 'User not in queue' });
    }

    res.status(200).json({ position: position + 1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFirst = async (req, res) => {
  try {
    const { queueId } = req.body;
    const user = await User.findOne({
      where: { queueId },
      order: [['createdAt', 'ASC']]
    });
    if (user) await user.destroy();
    res.status(200).json({ message: 'First user removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeUser = async (req, res) => {
  try {
    const { queueId, userId } = req.body;
    await User.destroy({ where: { queueId, userId } });
    res.status(200).json({ message: 'User removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.close = async (req, res) => {
  try {
    const id = parseInt(req.params.id); 
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Неправильний ID' });
    }
    const queue = await Queue.findByPk(id);
    if (!queue) return res.status(404).json({ error: 'Queue not found' });
    queue.isOpen = false;
    await queue.save();
    res.status(200).json({ message: 'Queue closed', queue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
