const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json({ success: true, data: users });
});

// @desc    Ban or unban a user
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
const toggleBanUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === 'ADMIN') {
      res.status(400);
      throw new Error('Cannot ban an admin');
    }
    user.isBanned = !user.isBanned;
    const updatedUser = await user.save();
    res.json({ success: true, message: `User ${user.isBanned ? 'banned' : 'unbanned'}`, data: updatedUser });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Moderate user bio/skills (clear inappropriate content)
// @route   PUT /api/admin/users/:id/moderate-bio
// @access  Private/Admin
const moderateUserBio = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.skillsOffered = [];
    user.skillsWanted = [];
    user.location = 'Moderated by Admin';
    const updatedUser = await user.save();
    res.json({ success: true, message: 'User profile moderated', data: updatedUser });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  getUsers,
  toggleBanUser,
  moderateUserBio
};
