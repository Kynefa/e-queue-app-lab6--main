const express = require('express');
const router = express.Router();
const queueController = require('../controllers/apiQueueController');

router.post('/queues/add-user', queueController.addUser);
router.get('/queues/position', queueController.getUserPosition);
router.delete('/queues/remove-user', queueController.removeUser);
router.delete('/queues/remove-first', queueController.removeFirst);
router.patch('/queues/:id/close', queueController.close);
// CRUD —
router.post('/queues', queueController.create);
router.get('/queues', queueController.findAll);
router.get('/queues/:id', queueController.findById);
router.put('/queues/:id', queueController.update);
router.delete('/queues/:id', queueController.delete); 

module.exports = router;