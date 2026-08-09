const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const { 
  getUserProfile, 
  getUserById,
  updateUserProfile, 
  searchUsers, 
  addUserReview, 
  getMatches, 
  getLeaderboard,
  uploadProfilePicture
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Setup Multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skillswap_profiles',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});
const upload = multer({ storage: storage });

// Routes
router.route('/search').get(protect, searchUsers);
router.route('/matches').get(protect, getMatches);
router.route('/leaderboard').get(getLeaderboard); // Public route
router.route('/me').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/upload').post(protect, upload.single('profilePhoto'), uploadProfilePicture);

// Make sure /:id comes AFTER specific routes like /search, /matches, /leaderboard, /me, /upload
// otherwise it will catch them as IDs!
router.route('/:id').get(protect, getUserById);
router.route('/:id/reviews').post(protect, addUserReview);

module.exports = router;
