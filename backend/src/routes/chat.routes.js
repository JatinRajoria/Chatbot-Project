const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const chatcontroller = require('../controllers/chat.controller');

const router = express.Router();

router.post('/', authMiddleware.authUser, chatcontroller.createChat);

module.exports = router;