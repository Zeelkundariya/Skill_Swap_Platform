"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { User, MapPin, ArrowRight, CheckCircle2, Star, Target, Sparkles, AlertCircle, Clock, Zap, ShieldCheck, Award, MessageSquare, GraduationCap, X, ChevronRight, Activity } from 'lucide-react';
import Link from 'next/link';

// Real backend data will be provided now, mock stats functions removed

// Counter animation component
const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500; // 1.5s
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <>{count}</>;
};

// Progress bar component
const ProgressBar = ({ label, percentage, colorClass }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm font-bold text-primary">{label}</span>
      <span className="text-sm font-bold text-secondary">{percentage}%</span>
    </div>
    <div className="w-full h-2.5 bg-black/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true }}
        className={`h-full rounded-full ${colorClass}`}
      />
    </div>
  </div>
);

export default function AIMatches() {
  const router = useRouter();
  const { user: currentUser, checkAuth } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(true);
  const [sortBy, setSortBy] = useState('match'); // 'match' or 'recent'
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareUser, setCompareUser] = useState(null);

  useEffect(() => {
    checkAuth();
    if (!localStorage.getItem('token')) {
      router.push('/login');
    } else {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/matches', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        const response = await res.json();
        setUsers(response.data || response);
        setTimeout(() => setAnalyzing(false), 2000);
      }
    } catch (err) {
      console.error(err);
      setAnalyzing(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !currentUser) {
    return <div className="flex-grow flex items-center justify-center min-h-[calc(100vh-4rem)]"><div className="animate-pulse w-12 h-12 bg-primary rounded-full"></div></div>;
  }

  // Users are already pre-scored and fully populated by the backend matching engine
  const scoredUsers = [...users].filter(u => u.score > 0).sort((a, b) => {
    if (sortBy === 'match') return b.score - a.score;
    // Assuming higher _id corresponds to more recent signups or similar sorting fallback
    return b._id.localeCompare(a._id); 
  });

  const bestMatch = scoredUsers.length > 0 ? scoredUsers[0] : null;
  const otherMatches = scoredUsers.slice(1);

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center space-x-3 mb-4 bg-primary/5 px-6 py-2 rounded-full border border-primary/10">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-black text-primary uppercase tracking-widest">AI Skill Match</h1>
        </div>
        <p className="text-secondary font-medium text-lg md:text-xl leading-relaxed mb-6">
          Our AI analyzes your skills, learning goals, availability, trust score, and community activity to recommend the best learning partners.
        </p>
        
        {/* Sort Toggle */}
        {!analyzing && scoredUsers.length > 0 && (
          <div className="inline-flex items-center bg-black/5 p-1 rounded-lg border border-black/10">
            <button 
              onClick={() => setSortBy('match')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${sortBy === 'match' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-primary'}`}
            >
              Highest Match %
            </button>
            <button 
              onClick={() => setSortBy('recent')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${sortBy === 'recent' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-primary'}`}
            >
              Recently Active
            </button>
          </div>
        )}
      </div>

      {analyzing ? (
        <div className="flex flex-col items-center justify-center py-32">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full mb-8 shadow-[0_0_30px_rgba(30,58,138,0.2)]"
          />
          <h2 className="text-2xl font-bold text-primary mb-3">AI Engine Processing...</h2>
          <p className="text-secondary font-medium text-lg">Cross-referencing millions of data points for perfect compatibility.</p>
        </div>
      ) : (
        <>
          {bestMatch ? (
            <div className="mb-16">
              <PremiumMatchCard 
                user={bestMatch} 
                onCompare={() => { setCompareUser(bestMatch); setCompareModalOpen(true); }} 
              />
            </div>
          ) : (
            <div className="bg-white border border-black/10 rounded-3xl p-16 text-center shadow-sm max-w-2xl mx-auto">
              <Target className="w-16 h-16 text-primary mx-auto mb-6 opacity-20" />
              <h3 className="text-2xl font-bold text-primary mb-4">No strong matches found</h3>
              <p className="text-secondary text-lg mb-8">Update your dashboard with more skills to help the AI engine find partners.</p>
              <Link href="/dashboard" className="inline-flex items-center px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-[#152843] transition-all shadow-md hover:shadow-lg">
                Update Profile <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          )}

          {otherMatches.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-8 uppercase tracking-widest opacity-80 flex items-center">
                <Activity className="w-5 h-5 mr-2" /> Other Recommended Matches
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherMatches.map((user, idx) => (
                  <OtherMatchCard key={user._id} user={user} idx={idx} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Compare Modal */}
      <AnimatePresence>
        {compareModalOpen && compareUser && (
          <CompareModal 
            currentUser={currentUser} 
            compareUser={compareUser} 
            onClose={() => setCompareModalOpen(false)} 
            otherMatches={otherMatches}
            onSelectCompare={(u) => setCompareUser(u)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------
// Premium AI Recommendation Card (Best Match)
// ---------------------------------------------------------
function PremiumMatchCard({ user, onCompare }) {
  const { extStats, stats } = user;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white rounded-[2rem] border border-black/10 shadow-xl overflow-hidden relative"
    >
      {/* Absolute top decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

      <div className="p-8 md:p-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8 md:gap-6 mb-12 border-b border-black/5 pb-10">
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-32 h-32 md:w-28 md:h-28 bg-white rounded-full flex items-center justify-center border-4 border-primary shadow-lg overflow-hidden z-10 relative">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-primary" />
                )}
              </div>
              <div className="absolute -bottom-3 right-1/2 translate-x-1/2 md:translate-x-0 md:-right-3 bg-white px-3 py-1 rounded-full border border-black/10 shadow-sm flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                <span className="text-xs font-bold text-primary">{stats.rating}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-black uppercase tracking-wider mb-3 md:mb-2">
                Best Match
              </div>
              <h2 className="text-3xl font-black text-primary mb-2 md:mb-1">{user.name}</h2>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 md:gap-4 text-secondary font-medium">
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {user.location || 'Remote'}</span>
                <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> {stats.swaps} Swaps</span>
              </div>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                {extStats.badges.map(badge => (
                  <span key={badge} className="inline-flex items-center px-3 py-1 bg-black/5 text-primary text-xs font-bold rounded-md hover:bg-primary hover:text-white transition-colors cursor-default">
                    <ShieldCheck className="w-3 h-3 mr-1" /> {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg viewBox="0 0 128 128" className="w-full h-full transform -rotate-90 absolute top-0 left-0">
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-black/5" />
                <motion.circle 
                  cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray={352} 
                  initial={{ strokeDashoffset: 352 }}
                  animate={{ strokeDashoffset: 352 - (352 * user.score) / 100 }}
                  transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                  className="text-primary drop-shadow-[0_0_10px_rgba(30,58,138,0.3)]" 
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center relative z-10">
                <span className="text-3xl font-black text-primary block leading-none">
                  <AnimatedCounter value={user.score} />%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Column 1: AI Insights */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h3 className="text-lg font-black text-primary mb-4 flex items-center uppercase tracking-wide">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-500" /> Why AI Recommended This Person
              </h3>
              <div className="space-y-4 bg-primary/5 rounded-2xl p-6 border border-primary/10">
                {user.explanations.slice(0, 5).map((exp, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + (i * 0.1) }}
                    key={i} 
                    className="flex items-start"
                  >
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-sm border border-black/5">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-primary font-medium text-sm leading-relaxed pt-0.5">{exp}</p>
                  </motion.div>
                ))}
                
                <div className="pt-4 mt-4 border-t border-primary/10 flex justify-between items-center">
                  <span className="text-xs font-bold text-primary uppercase">AI Confidence</span>
                  <span className="text-lg font-black text-primary">{extStats.successProb}%</span>
                </div>
              </div>
            </div>
            
            {/* Similar Skills */}
            <div>
              <h3 className="text-sm font-black text-secondary mb-3 uppercase tracking-wide flex items-center">
                Related Skills <ArrowRight className="w-3 h-3 ml-1" />
              </h3>
              <div className="flex flex-wrap gap-2">
                {extStats.relatedSkills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-white border border-black/10 rounded-lg text-xs font-bold text-secondary hover:text-primary hover:border-primary/40 cursor-pointer transition-all shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Breakdown & Challenges */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h3 className="text-sm font-black text-secondary mb-4 uppercase tracking-wide">Compatibility Breakdown</h3>
              <ProgressBar label="Skills Compatibility" percentage={extStats.skillsCompat} colorClass="bg-blue-500" />
              <ProgressBar label="Availability" percentage={extStats.availCompat} colorClass="bg-purple-500" />
              <ProgressBar label="Learning Goals" percentage={extStats.goalsCompat} colorClass="bg-green-500" />
              <ProgressBar label="Experience Level" percentage={extStats.expCompat} colorClass="bg-orange-500" />
              <ProgressBar label="Trust Score" percentage={extStats.trustCompat} colorClass="bg-indigo-500" />
              <ProgressBar label="Communication" percentage={extStats.commCompat} colorClass="bg-pink-500" />
            </div>

            {/* Potential Challenges */}
            {extStats.challenges.length > 0 && (
              <div>
                <h3 className="text-sm font-black text-secondary mb-3 uppercase tracking-wide flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1 text-orange-500" /> Things to Consider
                </h3>
                <div className="space-y-3">
                  {extStats.challenges.map((challenge, i) => (
                    <div key={i} className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
                      <p className="text-orange-900 font-bold text-sm mb-1">{challenge.text}</p>
                      <p className="text-orange-700 text-xs font-medium flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" /> AI Suggestion: {challenge.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Column 3: Predictions & Action */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Smart Recommendation Box */}
            <div className="bg-primary text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10">
                <Target className="w-24 h-24" />
              </div>
              <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-4 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" /> AI Recommendation
              </h3>
              <p className="text-sm font-medium mb-6 leading-relaxed text-white/90">
                This mentor is highly likely to complete a successful swap with you based on historical data.
              </p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-white/70 uppercase">Estimated Duration</span>
                  <span className="font-black">{extStats.estDays} Days</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-white/70 uppercase">Expected Rating</span>
                  <span className="font-black flex items-center">4.9 <Star className="w-3 h-3 ml-1 fill-white" /></span>
                </div>
                <div>
                  <span className="text-xs font-bold text-white/70 uppercase block mb-1">Suggested First Session</span>
                  <span className="font-bold text-sm bg-white/10 px-3 py-2 rounded-lg block border border-white/20">
                    {extStats.firstSession}
                  </span>
                </div>
              </div>
            </div>

            {/* Prediction Panel */}
            <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-black text-secondary mb-4 uppercase tracking-wide flex items-center">
                <Activity className="w-4 h-4 mr-2" /> Prediction Panel
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/5 p-3 rounded-xl text-center">
                  <div className="text-xs font-bold text-secondary uppercase mb-1">Success</div>
                  <div className="font-black text-primary text-lg">{extStats.successProb}%</div>
                </div>
                <div className="bg-black/5 p-3 rounded-xl text-center">
                  <div className="text-xs font-bold text-secondary uppercase mb-1">Sessions</div>
                  <div className="font-black text-primary text-lg">{extStats.estSessions}</div>
                </div>
                <div className="bg-black/5 p-3 rounded-xl text-center col-span-2">
                  <div className="text-xs font-bold text-secondary uppercase mb-1">Likely Response Time</div>
                  <div className="font-black text-primary">{extStats.respTime}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <Link href={`/swap/${user._id}`} className="block w-full">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 bg-primary text-white font-black rounded-xl hover:bg-[#152843] transition-colors shadow-md flex items-center justify-center group">
                  <Zap className="w-5 h-5 mr-2 opacity-80 group-hover:scale-110 transition-transform" /> Request Smart Swap
                </motion.button>
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <Link href={`/profile/${user._id}`} className="block">
                  <button className="w-full py-3 bg-white border border-black/10 text-primary font-bold rounded-xl hover:bg-black/5 transition-colors shadow-sm text-sm">
                    View Profile
                  </button>
                </Link>
                <button onClick={onCompare} className="w-full py-3 bg-white border border-black/10 text-primary font-bold rounded-xl hover:bg-black/5 transition-colors shadow-sm text-sm">
                  Compare Matches
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------
// Other Matches Card (Smaller representation)
// ---------------------------------------------------------
function OtherMatchCard({ user, idx }) {
  const { extStats, stats } = user;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-black/10 hover:shadow-lg transition-all flex flex-col group relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 overflow-hidden">
            {user.profilePicture ? <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-primary" />}
          </div>
          <div>
            <h3 className="font-bold text-primary text-lg">{user.name}</h3>
            <div className="flex items-center text-xs font-bold text-yellow-600">
              <Star className="w-3 h-3 fill-yellow-500 mr-1" /> {stats.rating} <span className="text-secondary ml-1">({stats.swaps})</span>
            </div>
          </div>
        </div>
        
        <div className="bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-lg text-center">
          <span className="block text-xl font-black text-primary leading-none"><AnimatedCounter value={user.score} />%</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">Match</span>
        </div>
      </div>

      <div className="bg-black/5 rounded-xl p-4 mb-5 flex-1 relative z-10 border border-black/5">
        <div className="text-[10px] font-black text-secondary uppercase tracking-widest mb-2 flex items-center">
          <Sparkles className="w-3 h-3 mr-1" /> AI Reason
        </div>
        <p className="text-sm font-medium text-primary line-clamp-2">
          {user.explanations[0] || "Recommended based on your overall profile compatibility."}
        </p>
      </div>

      <div className="flex gap-2 relative z-10">
        <div className="flex-1 text-center bg-white border border-black/10 py-2 rounded-lg">
          <div className="text-[10px] font-black uppercase text-secondary">Trust</div>
          <div className="text-sm font-bold text-primary">{extStats.trustCompat}%</div>
        </div>
        <Link href={`/swap/${user._id}`} className="flex-[2]">
          <button className="w-full h-full bg-white border border-black/10 hover:border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all text-sm shadow-sm group-hover:shadow flex items-center justify-center">
            Quick Request <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------
// Compare Modal
// ---------------------------------------------------------
function CompareModal({ currentUser, compareUser, onClose, otherMatches, onSelectCompare }) {
  // Select a second user to compare with. Default to the first in otherMatches, or someone else.
  const secondUser = otherMatches.find(u => u._id !== compareUser._id) || otherMatches[0];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 border border-black/10"
      >
        <div className="sticky top-0 bg-white/90 backdrop-blur-md p-6 border-b border-black/10 flex justify-between items-center z-20">
          <h2 className="text-xl font-black text-primary uppercase tracking-wide flex items-center">
            <Activity className="w-5 h-5 mr-2" /> AI Match Comparison
          </h2>
          <button onClick={onClose} className="p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-10">
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-1 border-r border-black/5 pr-6 flex flex-col justify-end pb-4">
              <span className="text-sm font-bold text-secondary uppercase tracking-widest block mb-2">Compare</span>
              <p className="text-primary font-medium text-sm">Select metrics below to see how AI evaluated these profiles against yours.</p>
            </div>
            
            {/* User 1 */}
            <div className="col-span-1 text-center bg-primary/5 rounded-2xl p-6 border border-primary/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 border border-black/10 flex items-center justify-center overflow-hidden">
                {compareUser.profilePicture ? <img src={compareUser.profilePicture} alt="" className="w-full h-full object-cover"/> : <User className="w-8 h-8 text-primary"/>}
              </div>
              <h3 className="font-bold text-primary text-lg">{compareUser.name}</h3>
              <div className="text-3xl font-black text-primary mt-2">{compareUser.score}%</div>
            </div>

            {/* User 2 */}
            <div className="col-span-1 text-center bg-black/5 rounded-2xl p-6 border border-black/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-secondary opacity-50"></div>
              {secondUser ? (
                <>
                  <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 border border-black/10 flex items-center justify-center overflow-hidden">
                    {secondUser.profilePicture ? <img src={secondUser.profilePicture} alt="" className="w-full h-full object-cover"/> : <User className="w-8 h-8 text-secondary"/>}
                  </div>
                  <h3 className="font-bold text-primary text-lg">{secondUser.name}</h3>
                  <div className="text-3xl font-black text-secondary mt-2">{secondUser.score}%</div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-50">
                  <User className="w-8 h-8 text-secondary mb-2" />
                  <span className="text-sm font-bold">No other matches</span>
                </div>
              )}
            </div>
          </div>

          {/* Comparison Rows */}
          {secondUser && (
            <div className="space-y-4">
              <CompareRow label="Skills Compatibility" v1={compareUser.extStats.skillsCompat + '%'} v2={secondUser.extStats.skillsCompat + '%'} h1={compareUser.extStats.skillsCompat > secondUser.extStats.skillsCompat} />
              <CompareRow label="Availability" v1={compareUser.extStats.availCompat + '%'} v2={secondUser.extStats.availCompat + '%'} h1={compareUser.extStats.availCompat > secondUser.extStats.availCompat} />
              <CompareRow label="Trust Score" v1={compareUser.extStats.trustCompat + '%'} v2={secondUser.extStats.trustCompat + '%'} h1={compareUser.extStats.trustCompat > secondUser.extStats.trustCompat} />
              <CompareRow label="Experience Level" v1={compareUser.extStats.expCompat + '%'} v2={secondUser.extStats.expCompat + '%'} h1={compareUser.extStats.expCompat > secondUser.extStats.expCompat} />
              <CompareRow label="Average Rating" v1={compareUser.stats.rating + '★'} v2={secondUser.stats.rating + '★'} h1={parseFloat(compareUser.stats.rating) > parseFloat(secondUser.stats.rating)} />
              <CompareRow label="Response Time" v1={compareUser.extStats.respTime} v2={secondUser.extStats.respTime} h1={compareUser.extStats.respTime.includes('2')} />
            </div>
          )}

          <div className="mt-10 bg-blue-50 border border-blue-100 rounded-xl p-6">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center"><Sparkles className="w-4 h-4 mr-2" /> AI Final Verdict</h4>
            <p className="text-sm text-blue-800 font-medium">
              Based on the aggregate analysis, <strong>{compareUser.name}</strong> is structurally a better fit due to higher overall trust signals and closer alignment with your primary learning objectives.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CompareRow({ label, v1, v2, h1 }) {
  return (
    <div className="grid grid-cols-3 gap-6 py-3 border-b border-black/5 last:border-0 items-center">
      <div className="col-span-1 text-sm font-bold text-secondary uppercase tracking-wider">{label}</div>
      <div className={`col-span-1 text-center font-bold p-2 rounded-lg ${h1 ? 'bg-green-50 text-green-700' : 'text-primary'}`}>{v1}</div>
      <div className={`col-span-1 text-center font-bold p-2 rounded-lg ${!h1 ? 'bg-green-50 text-green-700' : 'text-secondary'}`}>{v2}</div>
    </div>
  );
}
