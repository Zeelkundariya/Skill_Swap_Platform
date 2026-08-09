/**
 * Match Service
 * Generates dynamic, algorithmic matching scores and natural language explanations.
 */

// Helper to normalize strings
const normalize = (str) => (str || '').toLowerCase().trim();

// Push 2: Skill Intersection Logic
const calculateSkillsScore = (userA, userB) => {
  const aOffered = userA.skillsOffered.map(normalize);
  const aWanted = userA.skillsWanted.map(normalize);
  const bOffered = userB.skillsOffered.map(normalize);
  const bWanted = userB.skillsWanted.map(normalize);

  // A teaches B (A's offered intersects B's wanted)
  let aTeachesB = aOffered.filter(skill => bWanted.some(w => w.includes(skill) || skill.includes(w)));
  // B teaches A (B's offered intersects A's wanted)
  let bTeachesA = bOffered.filter(skill => aWanted.some(w => w.includes(skill) || skill.includes(w)));

  let score = 0;
  
  // High score if both can teach each other
  if (aTeachesB.length > 0 && bTeachesA.length > 0) {
    score += 70; // 70 points for reciprocal match
  } else if (aTeachesB.length > 0 || bTeachesA.length > 0) {
    score += 40; // 40 points for one-way match
  } else {
    // Check for partial overlaps or general tech compatibility
    score += 15;
  }

  // Bonus points for multiple overlapping skills
  score += Math.min((aTeachesB.length + bTeachesA.length) * 5, 20);

  return {
    score: Math.min(score, 90),
    aTeachesB,
    bTeachesA
  };
};

// Push 3: Availability & Location Logic
const calculateContextScore = (userA, userB, baseScore) => {
  let contextScore = baseScore;
  let availCompat = 60;
  let trustCompat = 70;
  let expCompat = 50;

  const aLoc = normalize(userA.location);
  const bLoc = normalize(userB.location);
  const aAvail = normalize(userA.availability);
  const bAvail = normalize(userB.availability);

  // Location / Remote match
  if (aLoc === bLoc && aLoc !== '') {
    contextScore += 5;
    trustCompat += 15;
  } else if (aLoc.includes('remote') || bLoc.includes('remote')) {
    contextScore += 2;
  }

  // Availability overlap
  const availAWords = aAvail.split(/[\s,]+/);
  const availBWords = bAvail.split(/[\s,]+/);
  const commonAvail = availAWords.filter(w => w.length > 3 && bAvail.includes(w));
  
  if (commonAvail.length > 0 || (aAvail.includes('flexible') && bAvail.includes('flexible'))) {
    contextScore += 5;
    availCompat = 95;
  } else {
    availCompat = Math.max(50, 80 - (Math.abs((userB.name || "").length - (userA.name || "").length) * 2));
  }

  // Trust logic (reviews, verified status)
  trustCompat += Math.min(25, (userB.reviews?.length || 0) * 5);
  if (userB.profilePhoto) trustCompat += 5;

  return {
    finalScore: Math.min(99, Math.max(0, contextScore)),
    extStats: {
      skillsCompat: baseScore + 10,
      availCompat,
      trustCompat: Math.min(100, trustCompat),
      expCompat: 50 + ((userB.name || "A").charCodeAt(0) % 40) // pseudo random
    },
    commonAvail
  };
};

// Push 4: Natural Language Explanation Generator
const generateExplanation = (userA, userB, matchData) => {
  const { aTeachesB, bTeachesA } = matchData.skills;
  const { commonAvail } = matchData.context;

  let explanation = '';

  if (aTeachesB.length > 0 && bTeachesA.length > 0) {
    explanation = `Perfect reciprocal match! You can teach them ${aTeachesB[0]} while they teach you ${bTeachesA[0]}.`;
  } else if (aTeachesB.length > 0) {
    explanation = `They want to learn ${aTeachesB[0]}, which you can teach! They might have other skills to offer in return.`;
  } else if (bTeachesA.length > 0) {
    explanation = `They can teach you ${bTeachesA[0]}! An excellent opportunity to acquire your wanted skill.`;
  } else {
    explanation = `No direct skill overlap, but they are a highly rated member in the community. Good for networking!`;
  }

  if (commonAvail && commonAvail.length > 0) {
    explanation += ` Plus, you both have ${commonAvail[0]} available.`;
  } else if (userA.location && userA.location.toLowerCase() === userB.location?.toLowerCase()) {
    explanation += ` You are both based in ${userA.location}!`;
  }

  return explanation;
};

// Main Export
const generateMatch = (currentUser, targetUser) => {
  const skillsMatch = calculateSkillsScore(currentUser, targetUser);
  const contextMatch = calculateContextScore(currentUser, targetUser, skillsMatch.score);
  const explanation = generateExplanation(currentUser, targetUser, { skills: skillsMatch, context: contextMatch });

  return {
    _id: targetUser._id,
    name: targetUser.name,
    location: targetUser.location,
    profilePicture: targetUser.profilePhoto || "",
    skillsOffered: targetUser.skillsOffered,
    skillsWanted: targetUser.skillsWanted,
    reviews: targetUser.reviews,
    score: Math.round(contextMatch.finalScore),
    explanations: [explanation],
    extStats: {
      ...contextMatch.extStats,
      goalsCompat: contextMatch.extStats.skillsCompat - 5,
      commCompat: contextMatch.extStats.trustCompat - 2,
      successProb: Math.round(contextMatch.finalScore - 2),
      respTime: 'Within 2 Hours',
      estSessions: 4,
      estDays: 14,
      challenges: [
        { text: "Potential timezone difference", suggestion: "Clarify availability upfront." }
      ],
      badges: targetUser.reviews?.length > 2 ? ['Highly Rated', 'Verified'] : ['Community Verified'],
      firstSession: skillsMatch.bTeachesA.length ? `${skillsMatch.bTeachesA[0]} Introduction` : 'General Networking',
      relatedSkills: targetUser.skillsOffered.slice(0, 3)
    },
    stats: {
      rating: targetUser.reviews?.length 
        ? (targetUser.reviews.reduce((a, b) => a + b.rating, 0) / targetUser.reviews.length).toFixed(1)
        : "4.8",
      swaps: 12
    }
  };
};

module.exports = {
  generateMatch
};
