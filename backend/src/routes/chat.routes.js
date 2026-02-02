const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const chatcontroller = require('../controllers/chat.controller');

const router = express.Router();

router.post('/', authMiddleware.authUser, chatcontroller.createChat);

router.get('/', authMiddleware.authUser, chatcontroller.getChats);

router.get('/messages/:id', authMiddleware.authUser, chatcontroller.getMessages);

router.put('/rename/:id', authMiddleware.authUser, chatcontroller.renameChat);

router.delete('/:id', authMiddleware.authUser, chatcontroller.deleteChat);

module.exports = router;