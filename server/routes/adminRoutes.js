const express = require('express');
const router = express.Router();
const { getUsers, toggleBanUser, moderateUserBio } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id/ban').put(protect, admin, toggleBanUser);
router.route('/users/:id/moderate-bio').put(protect, admin, moderateUserBio);

module.exports = router;
