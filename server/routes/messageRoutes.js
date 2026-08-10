const express = require('express');
const router = express.Router();
const { sendMessage, getConversation, getConversations } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, sendMessage);
router.route('/conversations/all').get(protect, getConversations);
router.route('/:userId').get(protect, getConversation);

module.exports = router;
