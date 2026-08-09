const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { generateMatch } = require('../services/matchService');

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      success: true,
      message: 'Profile fetched successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePhoto,
        location: user.location,
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted,
        availability: user.availability,
        isPublic: user.isPublic,
      }
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -email -role');

  if (user && user.isPublic) {
    res.json({
      success: true,
      message: 'User fetched successfully',
      data: user
    });
  } else {
    res.status(404);
    throw new Error('User not found or profile is private');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.profilePhoto = req.body.profilePicture || user.profilePhoto;
    user.location = req.body.location || user.location;

    if (req.body.skillsOffered) {
      user.skillsOffered = req.body.skillsOffered;
    }
    if (req.body.skillsWanted) {
      user.skillsWanted = req.body.skillsWanted;
    }

    user.availability = req.body.availability || user.availability;

    if (req.body.isPublic !== undefined) {
      user.isPublic = req.body.isPublic;
    }

    if (req.body.password) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePicture: updatedUser.profilePhoto,
        location: updatedUser.location,
        skillsOffered: updatedUser.skillsOffered,
        skillsWanted: updatedUser.skillsWanted,
        availability: updatedUser.availability,
        isPublic: updatedUser.isPublic,
      }
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Search public users by skill
// @route   GET /api/users/search
// @access  Private
const searchUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.skill
    ? {
      skillsOffered: {
        $regex: req.query.skill,
        $options: 'i',
      },
    }
    : {};

  const users = await User.find({ ...keyword, isPublic: true, _id: { $ne: req.user._id } }).select(
    '-password -email -role'
  );

  res.json({
    success: true,
    message: 'Users fetched successfully',
    data: users
  });
});

// @desc    Add a review to a user profile
// @route   POST /api/users/:id/reviews
// @access  Private
const addUserReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const userToReview = await User.findById(req.params.id);

  if (userToReview) {
    const review = {
      reviewerName: req.user.name,
      rating: Number(rating),
      comment,
    };

    userToReview.reviews.push(review);
    await userToReview.save();
    res.status(201).json({ 
      success: true,
      message: 'Review added successfully',
      data: review
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get AI Matches for current user
// @route   GET /api/users/matches
// @access  Private
const getMatches = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user._id);

  if (!currentUser) {
    res.status(404);
    throw new Error('User not found');
  }

  const otherUsers = await User.find({ isPublic: true, _id: { $ne: req.user._id } }).select(
    '-password -email -role'
  );

  let matches = otherUsers.map(targetUser => generateMatch(currentUser, targetUser));
  matches.sort((a, b) => b.score - a.score);

  res.json({
    success: true,
    message: 'Matches generated successfully',
    data: matches
  });
});

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
const getLeaderboard = asyncHandler(async (req, res) => {
  const topUsers = await User.find({ isPublic: true })
    .sort({ xp: -1 })
    .limit(50)
    .select('name profilePhoto xp level badges location reviews');

  const leaderboard = topUsers.map(user => {
    const totalReviews = user.reviews.length;
    const avgRating = totalReviews > 0 
      ? (user.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) 
      : 0;
    
    return {
      _id: user._id,
      name: user.name,
      profilePicture: user.profilePhoto,
      xp: user.xp,
      level: user.level,
      badges: user.badges,
      location: user.location,
      rating: Number(avgRating),
      reviewCount: totalReviews
    };
  });

  res.json({
    success: true,
    message: 'Leaderboard fetched successfully',
    data: leaderboard
  });
});

// @desc    Upload Profile Picture
// @route   POST /api/users/upload
// @access  Private
const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file provided');
  }

  const user = await User.findById(req.user._id);
  
  if (user) {
    user.profilePhoto = req.file.path; // Cloudinary returns URL in req.file.path
    await user.save();
    
    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        profilePicture: user.profilePhoto
      }
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


module.exports = {
  getUserProfile,
  getUserById,
  updateUserProfile,
  searchUsers,
  addUserReview,
  getMatches,
  getLeaderboard,
  uploadProfilePicture
};
