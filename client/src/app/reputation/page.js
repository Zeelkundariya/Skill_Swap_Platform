"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Trophy, Star, ShieldCheck, TrendingUp, Award, Clock, Zap, Target, 
  ChevronRight, Users, CheckCircle2, Activity, Info, Sparkles, MessageSquare, Flame
} from 'lucide-react';
import Link from 'next/link';

// Mock Data
const userStats = {
  xp: 4250,
  nextLevelXp: 5000,
  level: "Expert Mentor",
  nextLevel: "Master Mentor",
  trustScore: 96,
  completedSwaps: 28,
  studentsHelped: 74,
  skillsShared: 12,
  averageRating: 4.9,
  communityRank: 42,
  learningStreak: 21
};

const xpEarningRules = [
  { action: "Complete Swap", xp: "+100 XP", icon: <CheckCircle2 className="w-5 h-5 text-green-500" /> },
  { action: "Teach Someone", xp: "+80 XP", icon: <Users className="w-5 h-5 text-blue-500" /> },
  { action: "Receive 5 Star Rating", xp: "+60 XP", icon: <Star className="w-5 h-5 text-yellow-500" /> },
  { action: "Help Beginners", xp: "+120 XP", icon: <Target className="w-5 h-5 text-purple-500" /> },
  { action: "Weekly Learning Streak", xp: "+70 XP", icon: <Flame className="w-5 h-5 text-orange-500" /> },
  { action: "Complete Profile", xp: "+50 XP", icon: <User className="w-5 h-5 text-indigo-500" /> },
  { action: "Verify Email", xp: "+40 XP", icon: <ShieldCheck className="w-5 h-5 text-teal-500" /> },
  { action: "Daily Login", xp: "+10 XP", icon: <Zap className="w-5 h-5 text-yellow-400" /> }
];

const levels = [
  { name: "Beginner", icon: "🌱", xp: 100, unlocked: true },
  { name: "Explorer", icon: "🧭", xp: 500, unlocked: true },
  { name: "Mentor", icon: "🎓", xp: 1000, unlocked: true },
  { name: "Expert", icon: "⭐", xp: 2500, unlocked: true, current: true },
  { name: "Master", icon: "💎", xp: 5000, unlocked: false },
  { name: "Grand Mentor", icon: "👑", xp: 10000, unlocked: false }
];

const trustBreakdown = [
  { name: "Verified Email", score: 100 },
  { name: "Completed Swaps", score: 95 },
  { name: "Average Rating", score: 98 },
  { name: "Attendance", score: 98 },
  { name: "Response Time", score: 90 },
  { name: "Profile Completion", score: 100 }
];

const badges = [
  { name: "First Swap", icon: "🏅", unlocked: true, desc: "Completed your first skill swap." },
  { name: "5-Star Teacher", icon: "⭐", unlocked: true, desc: "Received five 5-star ratings in a row." },
  { name: "10 Swaps", icon: "🔥", unlocked: true, desc: "Successfully completed 10 skill swaps." },
  { name: "Community Helper", icon: "💎", unlocked: true, desc: "Helped 5 beginners." },
  { name: "Knowledge Master", icon: "🎓", unlocked: true, desc: "Taught 3 different skills." },
  { name: "Top Mentor", icon: "🏆", unlocked: true, desc: "Reached the top 10% of mentors." },
  { name: "Global Mentor", icon: "🌍", unlocked: false, desc: "Swap with users from 5 different countries." },
  { name: "100 Swaps", icon: "🤝", unlocked: false, desc: "Complete 100 total swaps." },
  { name: "Fast Responder", icon: "⚡", unlocked: false, desc: "Maintain a <1 hour response time for 30 days." },
  { name: "Perfect Attendance", icon: "🎯", unlocked: false, desc: "0 cancelled swaps for 6 months." },
  { name: "Legend Mentor", icon: "👑", unlocked: false, desc: "Reach the Grand Mentor tier." }
];

const recentAchievements = [
  { title: "Completed React Swap", xp: "+100 XP", time: "Today", icon: "🏅" },
  { title: "Earned 5 Star Rating", xp: "+60 XP", time: "Yesterday", icon: "⭐" },
  { title: "Reached Mentor Level", xp: "+300 XP", time: "3 Days Ago", icon: "🎓" },
  { title: "Earned Community Helper Badge", xp: "Badge Unlocked", time: "1 Week Ago", icon: "💎" }
];

const leaderboard = [
  { rank: 10, name: "Sarah Smith", score: "4800 XP" },
  { rank: 11, name: "Alex Rivera", score: "4500 XP" },
  { rank: 12, name: "You", score: "4250 XP", isCurrent: true },
  { rank: 13, name: "James Lee", score: "4100 XP" }
];

// Helper icon import for user since it wasn't in lucide-react list above
import { User } from 'lucide-react';

export default function ReputationDashboard() {
  const router = useRouter();
  const { user, checkAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    checkAuth();
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
    setMounted(true);
  }, []);

  if (!user || !mounted) return null;

  const xpPercentage = (userStats.xp / userStats.nextLevelXp) * 100;

  return (
    <div className="flex-grow bg-[#FAFAFA] min-h-screen pb-32">
      
      {/* Page Header */}
      <div className="bg-white border-b border-black/5 pt-12 pb-12 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full mb-6 border-4 border-yellow-200">
            <Trophy className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-primary mb-4 tracking-tight">
            Reputation & <span className="text-blue-600">Growth</span>
          </h1>
          <p className="text-secondary text-lg max-w-2xl mx-auto font-medium">
            Build your reputation by teaching, learning, helping others, and completing successful skill swaps.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* SECTION 1: OVERALL REPUTATION HERO CARD */}
        <section>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 md:p-12 border border-black/10 shadow-lg relative overflow-hidden"
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 opacity-60"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
              
              {/* Left: XP Progress */}
              <div className="flex-1 w-full text-center md:text-left">
                <h3 className="text-sm font-black uppercase tracking-widest text-secondary mb-2">Current Level</h3>
                <h2 className="text-4xl font-black text-primary flex items-center justify-center md:justify-start gap-3 mb-8">
                  <span className="text-5xl">⭐</span> {userStats.level}
                </h2>

                <div className="mb-4 flex justify-between items-end">
                  <div>
                    <span className="text-4xl font-black text-blue-600">{userStats.xp}</span>
                    <span className="text-secondary font-bold ml-2">XP</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-secondary uppercase">Next Level: {userStats.nextLevel}</span>
                  </div>
                </div>

                <div className="h-6 w-full bg-black/5 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute top-0 left-0 bottom-0 bg-blue-600 rounded-full"
                  />
                  {/* Stripes effect */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_25%,rgba(255,255,255,0.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.2)_75%,rgba(255,255,255,0.2)_100%)] bg-[length:20px_20px]"></div>
                </div>

                <div className="mt-4 flex justify-between text-xs font-bold text-secondary">
                  <span>0 XP</span>
                  <span>{userStats.nextLevelXp - userStats.xp} XP to level up</span>
                  <span>{userStats.nextLevelXp} XP</span>
                </div>
              </div>

              {/* Right: Trust Score */}
              <div className="w-full md:w-auto flex flex-col items-center justify-center">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="rgba(0,0,0,0.05)" strokeWidth="12" fill="none" />
                    <motion.circle 
                      initial={{ strokeDasharray: "0 251.2" }}
                      animate={{ strokeDasharray: `${(userStats.trustScore / 100) * 251.2} 251.2` }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      cx="50" cy="50" r="40" 
                      stroke="#10B981" 
                      strokeWidth="12" 
                      fill="none" 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-black text-primary">{userStats.trustScore}%</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary mt-1">Trust Score</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-16">
            
            {/* SECTION 3: LEVEL SYSTEM */}
            <section>
              <h2 className="text-2xl font-black text-primary mb-8 flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-blue-600" /> Rank Progression
              </h2>
              <div className="bg-white rounded-3xl border border-black/10 p-8 shadow-sm">
                <div className="relative border-l-4 border-black/5 ml-6 space-y-10">
                  {levels.map((lvl, idx) => (
                    <div key={idx} className={`relative flex items-center ${!lvl.unlocked ? 'opacity-40 blur-[1px]' : ''}`}>
                      <div className={`absolute -left-[2.15rem] w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-md z-10 text-2xl ${
                        lvl.current ? 'bg-blue-100 ring-4 ring-blue-500/20' : 
                        lvl.unlocked ? 'bg-gray-100' : 'bg-gray-50'
                      }`}>
                        {lvl.icon}
                      </div>
                      <div className="ml-16">
                        <div className="flex items-center gap-3">
                          <h3 className={`text-xl font-black ${lvl.current ? 'text-blue-600' : 'text-primary'}`}>{lvl.name}</h3>
                          {lvl.current && <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md">CURRENT</span>}
                        </div>
                        <p className="text-sm font-bold text-secondary mt-1">{lvl.xp.toLocaleString()} XP Required</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 4 & 5: TRUST SCORE BREAKDOWN & AI ANALYSIS */}
            <section>
              <h2 className="text-2xl font-black text-primary mb-8 flex items-center">
                <ShieldCheck className="w-6 h-6 mr-3 text-green-500" /> Trust & Reputation
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Breakdown */}
                <div className="bg-white rounded-3xl border border-black/10 p-6 shadow-sm">
                  <h3 className="text-sm font-black uppercase tracking-widest text-secondary mb-6">Score Breakdown</h3>
                  <div className="space-y-5">
                    {trustBreakdown.map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm font-bold mb-2">
                          <span className="text-primary">{item.name}</span>
                          <span className="text-green-600">{item.score}%</span>
                        </div>
                        <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.score}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className="h-full bg-green-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t border-black/5 flex justify-between text-sm font-bold">
                      <span className="text-primary flex items-center"><Info className="w-4 h-4 mr-1 text-secondary" /> Reports</span>
                      <span className="text-green-600">0</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-primary flex items-center"><Info className="w-4 h-4 mr-1 text-secondary" /> Cancelled Swaps</span>
                      <span className="text-yellow-600">1</span>
                    </div>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="bg-[#152843] rounded-3xl p-6 shadow-sm text-white flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                  
                  <h3 className="text-sm font-black uppercase tracking-widest text-blue-300 mb-6 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" /> AI Reputation Analysis
                  </h3>
                  
                  <p className="font-bold text-lg leading-tight mb-4">Your reputation is excellent.</p>
                  
                  <p className="text-sm text-blue-100 font-medium mb-2 opacity-80">Users trust you because:</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start text-sm font-medium"><CheckCircle2 className="w-4 h-4 mr-2 text-green-400 shrink-0 mt-0.5" /> Fast responses</li>
                    <li className="flex items-start text-sm font-medium"><CheckCircle2 className="w-4 h-4 mr-2 text-green-400 shrink-0 mt-0.5" /> High attendance</li>
                    <li className="flex items-start text-sm font-medium"><CheckCircle2 className="w-4 h-4 mr-2 text-green-400 shrink-0 mt-0.5" /> Consistently positive ratings</li>
                  </ul>

                  <div className="mt-auto bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                    <p className="text-xs font-black uppercase tracking-widest text-blue-300 mb-2">AI Suggestion</p>
                    <p className="text-sm font-medium mb-3">Improve response time to reach 99% trust.</p>
                    <div className="flex items-center justify-between font-bold text-sm">
                      <span className="opacity-70">Current: 96%</span>
                      <span className="text-green-400">Potential: 99%</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 6: BADGES */}
            <section>
              <h2 className="text-2xl font-black text-primary mb-8 flex items-center">
                <Award className="w-6 h-6 mr-3 text-yellow-500" /> Achievement Badges
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {badges.map((badge, idx) => (
                  <div key={idx} className={`relative group cursor-pointer`}>
                    <motion.div 
                      whileHover={{ scale: 1.05, y: -5 }}
                      className={`bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center border transition-all h-full ${
                        badge.unlocked ? 'border-yellow-200 shadow-sm hover:shadow-md hover:border-yellow-400' : 'border-black/5 opacity-50 grayscale bg-gray-50'
                      }`}
                    >
                      <span className="text-4xl mb-3 block group-hover:animate-bounce">{badge.icon}</span>
                      <h4 className="font-bold text-primary text-sm leading-tight">{badge.name}</h4>
                    </motion.div>
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-black text-white text-xs font-bold p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                      {badge.desc}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 9: LEARNING STREAK HEATMAP */}
            <section>
              <h2 className="text-2xl font-black text-primary mb-8 flex items-center">
                <Flame className="w-6 h-6 mr-3 text-orange-500" /> Learning Streak
              </h2>
              <div className="bg-white rounded-3xl border border-black/10 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                      <Flame className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-primary text-xl">21 Days</h3>
                      <p className="text-xs font-bold uppercase tracking-widest text-secondary">Current Streak</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Longest Streak</p>
                    <p className="font-black text-primary">34 Days</p>
                  </div>
                </div>

                {/* Mock Heatmap Grid */}
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-1.5 min-w-max">
                    {Array.from({ length: 52 }).map((_, col) => (
                      <div key={col} className="flex flex-col gap-1.5">
                        {Array.from({ length: 7 }).map((_, row) => {
                          // Randomize fill for visual effect
                          const isFilled = Math.random() > 0.6;
                          const intensity = isFilled ? Math.floor(Math.random() * 4) + 1 : 0;
                          const bgColors = [
                            'bg-gray-100', // 0
                            'bg-green-200', // 1
                            'bg-green-300', // 2
                            'bg-green-500', // 3
                            'bg-green-600'  // 4
                          ];
                          return (
                            <div 
                              key={`${col}-${row}`} 
                              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-sm ${bgColors[intensity]} hover:ring-2 hover:ring-black/20 transition-all cursor-pointer`}
                              title={`${intensity} swaps completed`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end items-center gap-2 mt-4 text-xs font-bold text-secondary">
                  <span>Less</span>
                  <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-200"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-300"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-600"></div>
                  <span>More</span>
                </div>
              </div>
            </section>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-8">
            
            {/* SECTION 2: HOW XP IS EARNED */}
            <div className="bg-white rounded-3xl border border-black/10 p-6 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-secondary mb-6">How to Earn XP</h3>
              <div className="space-y-3">
                {xpEarningRules.map((rule, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 transition-all cursor-default border border-transparent hover:border-black/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-black/5">
                        {rule.icon}
                      </div>
                      <span className="font-bold text-primary text-sm">{rule.action}</span>
                    </div>
                    <span className="font-black text-blue-600 text-sm bg-blue-50 px-2 py-1 rounded-md">{rule.xp}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* SECTION 8: COMMUNITY REPUTATION STATS */}
            <div className="bg-white rounded-3xl border border-black/10 p-6 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-secondary mb-6">Community Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-black/5 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">Swaps</p>
                  <p className="text-2xl font-black text-primary">{userStats.completedSwaps}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-black/5 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">Students</p>
                  <p className="text-2xl font-black text-primary">{userStats.studentsHelped}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-black/5 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">Rating</p>
                  <p className="text-2xl font-black text-primary flex items-center justify-center">
                    {userStats.averageRating} <Star className="w-3 h-3 ml-1 fill-yellow-500 text-yellow-500" />
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Rank</p>
                  <p className="text-2xl font-black text-blue-700">#{userStats.communityRank}</p>
                </div>
              </div>
            </div>

            {/* SECTION 10: LEADERBOARD */}
            <div className="bg-white rounded-3xl border border-black/10 p-6 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-secondary mb-6 flex items-center justify-between">
                <span>Leaderboard</span>
                <span className="text-blue-600 text-xs">Top 5%</span>
              </h3>
              <div className="space-y-1">
                {leaderboard.map((u, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-3 rounded-xl ${u.isCurrent ? 'bg-blue-50 border border-blue-100' : 'hover:bg-black/5'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-black w-6 text-center ${u.isCurrent ? 'text-blue-600' : 'text-secondary'}`}>#{u.rank}</span>
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold border border-white shadow-sm overflow-hidden">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className={`font-bold text-sm ${u.isCurrent ? 'text-blue-700' : 'text-primary'}`}>{u.name}</span>
                    </div>
                    <span className={`font-black text-xs ${u.isCurrent ? 'text-blue-600' : 'text-secondary'}`}>{u.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 7: RECENT ACHIEVEMENTS */}
            <div className="bg-white rounded-3xl border border-black/10 p-6 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-secondary mb-6">Recent History</h3>
              <div className="relative border-l-2 border-black/5 ml-3 space-y-6">
                {recentAchievements.map((ach, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div className="absolute -left-[13px] top-0 w-6 h-6 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center text-[10px]">
                      {ach.icon}
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-secondary mb-1">{ach.time}</p>
                    <p className="font-bold text-primary text-sm mb-1">{ach.title}</p>
                    <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs font-black rounded-md">{ach.xp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 11: AI RECOMMENDATIONS TO LEVEL UP */}
            <div className="bg-[#152843] rounded-3xl p-6 shadow-sm text-white">
              <h3 className="text-sm font-black uppercase tracking-widest text-blue-300 mb-4 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" /> Level Up Faster
              </h3>
              <p className="text-sm font-medium mb-4">How to reach <strong className="text-white">Master Mentor</strong>:</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm bg-white/10 p-3 rounded-xl">
                  <span className="font-medium flex items-center"><Users className="w-4 h-4 mr-2 text-blue-300" /> Teach beginners</span>
                  <span className="font-bold text-green-400">+120 XP</span>
                </div>
                <div className="flex items-center justify-between text-sm bg-white/10 p-3 rounded-xl">
                  <span className="font-medium flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-blue-300" /> Complete 2 Swaps</span>
                  <span className="font-bold text-green-400">+200 XP</span>
                </div>
                <div className="flex items-center justify-between text-sm bg-white/10 p-3 rounded-xl">
                  <span className="font-medium flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-blue-300" /> Verify Phone</span>
                  <span className="font-bold text-green-400">+100 XP</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-300">Est. Time</p>
                  <p className="font-bold">5 Days</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-300">Potential Gain</p>
                  <p className="font-black text-green-400">+420 XP</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
