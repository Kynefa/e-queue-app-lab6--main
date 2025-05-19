const express = require('express');
const router = express.Router();
const controller = require('../controllers/queueController');

router.get('/', controller.index);// GET-запит до головної сторінки — показує список черг
router.post('/create', controller.createQueue);// POST-запит для створення нової черги
router.post('/add', controller.addUser);// POST-запит для додавання користувача до черги
router.post('/position', controller.getUserPosition);// POST-запит для перевірки позиції користувача в черзі
router.post('/next', controller.removeFirst);// POST-запит для видалення першого користувача з черги (просунути чергу)
router.post('/remove', controller.removeUser);// POST-запит для видалення конкретного користувача з черги
router.post('/close', controller.closeQueue);// POST-запит для закриття черги

module.exports = router;
