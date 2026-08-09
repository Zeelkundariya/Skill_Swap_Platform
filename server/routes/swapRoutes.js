const express = require('express');
const router = express.Router();
const { 
  createSwapRequest, 
  getMySwapRequests,
  acceptSwapRequest,
  rejectSwapRequest,
  cancelSwapRequest,
  completeSwapRequest,
  proposeSchedule
} = require('../controllers/swapController');
const { protect } = require('../middleware/authMiddleware');

router.route('/request').post(protect, createSwapRequest);
router.route('/my-requests').get(protect, getMySwapRequests);

router.route('/:id/accept').put(protect, acceptSwapRequest);
router.route('/:id/reject').put(protect, rejectSwapRequest);
router.route('/:id/cancel').delete(protect, cancelSwapRequest);
router.route('/:id/complete').post(protect, completeSwapRequest);
router.route('/:id/schedule').put(protect, proposeSchedule);

module.exports = router;
