const asyncHandler = require('express-async-handler');
const SwapRequest = require('../models/swapRequestModel');
const User = require('../models/userModel');
// const { awardXP } = require('../services/xpService');

// @desc    Create new swap request
// @route   POST /api/swaps/request
// @access  Private
const createSwapRequest = asyncHandler(async (req, res) => {
  const { receiverId, message, offeredSkills, requestedSkills } = req.body;

  if (!receiverId || !offeredSkills || !requestedSkills) {
    res.status(400);
    throw new Error('Please provide receiverId, offeredSkills, and requestedSkills');
  }

  const swapRequest = new SwapRequest({
    senderId: req.user._id,
    receiverId,
    message,
    offeredSkills,
    requestedSkills,
    status: 'PENDING',
  });

  const createdSwapRequest = await swapRequest.save();

  res.status(201).json({
    success: true,
    message: 'Swap request created successfully',
    data: createdSwapRequest
  });
});

// @desc    Get user's swap requests (incoming and outgoing)
// @route   GET /api/swaps/my-requests
// @access  Private
const getMySwapRequests = asyncHandler(async (req, res) => {
  const requests = await SwapRequest.find({
    $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
  }).populate('senderId', 'name profilePhoto').populate('receiverId', 'name profilePhoto');

  res.json({
    success: true,
    message: 'Requests fetched successfully',
    data: requests
  });
});

// @desc    Accept a swap request
// @route   PUT /api/swaps/:id/accept
// @access  Private
const acceptSwapRequest = asyncHandler(async (req, res) => {
  const request = await SwapRequest.findById(req.params.id);

  if (request) {
    if (request.receiverId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to accept this request');
    }
    request.status = 'ACCEPTED';
    const updatedRequest = await request.save();
    res.json({
      success: true,
      message: 'Request accepted',
      data: updatedRequest
    });
  } else {
    res.status(404);
    throw new Error('Request not found');
  }
});

// @desc    Reject a swap request
// @route   PUT /api/swaps/:id/reject
// @access  Private
const rejectSwapRequest = asyncHandler(async (req, res) => {
  const request = await SwapRequest.findById(req.params.id);

  if (request) {
    if (request.receiverId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to reject this request');
    }
    request.status = 'REJECTED';
    const updatedRequest = await request.save();
    res.json({
      success: true,
      message: 'Request rejected',
      data: updatedRequest
    });
  } else {
    res.status(404);
    throw new Error('Request not found');
  }
});

// @desc    Cancel a swap request (Sender only)
// @route   DELETE /api/swaps/:id/cancel
// @access  Private
const cancelSwapRequest = asyncHandler(async (req, res) => {
  const request = await SwapRequest.findById(req.params.id);

  if (request) {
    if (request.senderId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to cancel this request');
    }
    if (request.status !== 'PENDING') {
      res.status(400);
      throw new Error('Can only cancel PENDING requests');
    }
    await request.deleteOne();
    res.json({
      success: true,
      message: 'Request cancelled'
    });
  } else {
    res.status(404);
    throw new Error('Request not found');
  }
});

// @desc    Complete a swap and submit feedback
// @route   POST /api/swaps/:id/complete
// @access  Private
const completeSwapRequest = asyncHandler(async (req, res) => {
  const request = await SwapRequest.findById(req.params.id);
  const { rating, comment } = req.body;

  if (request) {
    if (request.status !== 'ACCEPTED') {
      res.status(400);
      throw new Error('Can only complete ACCEPTED requests');
    }

    const Feedback = require('../models/feedbackModel');
    
    let targetUserId = request.senderId.toString() === req.user._id.toString() ? request.receiverId : request.senderId;

    await Feedback.create({
      swapId: request._id,
      reviewerId: req.user._id,
      targetUserId,
      rating,
      comment
    });

    request.status = 'COMPLETED';
    await request.save();

    // Gamification: Award XP to both users for completing a swap
    const completedSwapsCountSender = await SwapRequest.countDocuments({ 
      senderId: request.senderId, 
      status: 'COMPLETED' 
    });
    const completedSwapsCountReceiver = await SwapRequest.countDocuments({ 
      receiverId: request.receiverId, 
      status: 'COMPLETED' 
    });

    // const senderGamification = await awardXP(request.senderId, 50, completedSwapsCountSender);
    // const receiverGamification = await awardXP(request.receiverId, 50, completedSwapsCountReceiver);

    res.json({ 
      success: true,
      message: 'Swap completed and feedback submitted'
    });
  } else {
    res.status(404);
    throw new Error('Request not found');
  }
});

// @desc    Propose a schedule for a swap request
// @route   PUT /api/swaps/:id/schedule
// @access  Private
const proposeSchedule = asyncHandler(async (req, res) => {
  const request = await SwapRequest.findById(req.params.id);
  const { scheduledDate, duration } = req.body;

  if (request) {
    if (request.senderId.toString() !== req.user._id.toString() && request.receiverId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to schedule this swap');
    }
    
    request.scheduledDate = scheduledDate;
    request.duration = duration || 60;
    
    // Auto-generate a meeting link when schedule is proposed/agreed upon
    request.meetingLink = `https://meet.skillsphere.com/${request._id}`;

    await request.save();
    res.json({
      success: true,
      message: 'Schedule proposed',
      data: request
    });
  } else {
    res.status(404);
    throw new Error('Request not found');
  }
});

module.exports = {
  createSwapRequest,
  getMySwapRequests,
  acceptSwapRequest,
  rejectSwapRequest,
  cancelSwapRequest,
  completeSwapRequest,
  proposeSchedule
};
