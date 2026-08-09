const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getMe, 
  verifyEmail, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/authController');

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required')
];

router.post('/register', registerValidation, validate, registerUser);
router.post('/login', loginValidation, validate, loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);
router.post('/verify-email', protect, verifyEmail);
router.post('/forgot-password', [body('email').isEmail()], validate, forgotPassword);
router.post('/reset-password', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('resetToken').notEmpty()
], validate, resetPassword);

module.exports = router;
