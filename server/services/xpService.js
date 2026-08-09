const User = require('../models/userModel');

// Level thresholds
const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  2000,   // Level 6
  5000,   // Level 7
];

const getLevelFromXP = (xp) => {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
};

const checkAndAwardBadges = (user, xp, completedSwapsCount) => {
  const newBadges = [];
  
  if (completedSwapsCount === 1 && !user.badges.includes('First Swap')) {
    newBadges.push('First Swap');
  }
  if (completedSwapsCount >= 5 && !user.badges.includes('Mentor Trainee')) {
    newBadges.push('Mentor Trainee');
  }
  if (completedSwapsCount >= 10 && !user.badges.includes('Pro Mentor')) {
    newBadges.push('Pro Mentor');
  }
  if (user.level >= 5 && !user.badges.includes('Top Tier')) {
    newBadges.push('Top Tier');
  }

  return newBadges;
};

/**
 * Award XP to a user and check for level-ups or badges.
 * @param {ObjectId} userId - The user to award XP to
 * @param {Number} xpAmount - The amount of XP to add
 * @param {Number} completedSwapsCount - Total completed swaps for badge checks
 * @returns {Object} { leveledUp, newLevel, newBadges }
 */
const awardXP = async (userId, xpAmount, completedSwapsCount = 0) => {
  const user = await User.findById(userId);
  if (!user) return null;

  const previousLevel = user.level;
  user.xp += xpAmount;
  
  // Calculate new level
  user.level = getLevelFromXP(user.xp);
  const leveledUp = user.level > previousLevel;

  // Check badges
  const newBadges = checkAndAwardBadges(user, user.xp, completedSwapsCount);
  if (newBadges.length > 0) {
    user.badges = [...user.badges, ...newBadges];
  }

  await user.save();

  return {
    leveledUp,
    newLevel: user.level,
    newBadges,
    xp: user.xp
  };
};

module.exports = {
  awardXP,
  getLevelFromXP,
  LEVEL_THRESHOLDS
};
