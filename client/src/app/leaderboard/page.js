"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, MapPin, Medal } from 'lucide-react';
import Link from 'next/link';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/leaderboard');
      if (res.ok) {
        const response = await res.json();
        setUsers(response.data || response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex-grow flex items-center justify-center min-h-[calc(100vh-4rem)]"><div className="animate-pulse w-12 h-12 bg-primary rounded-full"></div></div>;
  }

  const topThree = users.slice(0, 3);
  const others = users.slice(3);

  return (
    <div className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center space-x-3 mb-4 bg-yellow-50 px-6 py-2 rounded-full border border-yellow-200 shadow-sm">
            <Trophy className="w-6 h-6 text-yellow-600" />
            <h1 className="text-2xl font-black text-yellow-700 uppercase tracking-widest">Global Leaderboard</h1>
          </div>
          <p className="text-secondary font-medium text-lg md:text-xl max-w-2xl mx-auto">
            The top mentors in the SkillSphere community. Swap skills, earn XP, and climb the ranks!
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 mb-16">
          {/* 2nd Place */}
          {topThree[1] && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="w-full md:w-64 flex flex-col items-center bg-gradient-to-t from-gray-100 to-white rounded-t-3xl pt-8 pb-6 px-4 shadow-sm border border-gray-200 md:order-1 order-2"
            >
              <div className="relative mb-4">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gray-300 text-gray-700 font-black rounded-full flex items-center justify-center shadow-md border-2 border-white z-10">2</div>
                <img src={topThree[1].profilePhoto || `https://ui-avatars.com/api/?name=${topThree[1].name}&background=random`} alt={topThree[1].name} className="w-20 h-20 rounded-full border-4 border-gray-200 shadow-lg object-cover" />
              </div>
              <h3 className="font-bold text-lg text-primary text-center truncate w-full">{topThree[1].name}</h3>
              <p className="text-sm font-black text-secondary">Lvl {topThree[1].level} • {topThree[1].xp} XP</p>
            </motion.div>
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="w-full md:w-72 flex flex-col items-center bg-gradient-to-t from-yellow-100 to-white rounded-t-3xl pt-10 pb-8 px-4 shadow-xl border border-yellow-200 md:order-2 order-1 z-10 relative"
            >
              <div className="absolute -top-10">
                <Trophy className="w-16 h-16 text-yellow-500 drop-shadow-md" />
              </div>
              <div className="relative mb-4 mt-6">
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-yellow-400 text-yellow-900 font-black text-lg rounded-full flex items-center justify-center shadow-md border-2 border-white z-10">1</div>
                <img src={topThree[0].profilePhoto || `https://ui-avatars.com/api/?name=${topThree[0].name}&background=random`} alt={topThree[0].name} className="w-28 h-28 rounded-full border-4 border-yellow-300 shadow-lg object-cover" />
              </div>
              <h3 className="font-black text-xl text-primary text-center truncate w-full">{topThree[0].name}</h3>
              <p className="text-md font-black text-yellow-600">Lvl {topThree[0].level} • {topThree[0].xp} XP</p>
              <div className="flex items-center space-x-1 mt-2 bg-white px-3 py-1 rounded-full shadow-sm text-xs font-bold text-primary">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span>{topThree[0].rating} ({topThree[0].reviewCount})</span>
              </div>
            </motion.div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="w-full md:w-64 flex flex-col items-center bg-gradient-to-t from-orange-100 to-white rounded-t-3xl pt-8 pb-6 px-4 shadow-sm border border-orange-200 md:order-3 order-3"
            >
              <div className="relative mb-4">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-orange-400 text-white font-black rounded-full flex items-center justify-center shadow-md border-2 border-white z-10">3</div>
                <img src={topThree[2].profilePhoto || `https://ui-avatars.com/api/?name=${topThree[2].name}&background=random`} alt={topThree[2].name} className="w-20 h-20 rounded-full border-4 border-orange-200 shadow-lg object-cover" />
              </div>
              <h3 className="font-bold text-lg text-primary text-center truncate w-full">{topThree[2].name}</h3>
              <p className="text-sm font-black text-secondary">Lvl {topThree[2].level} • {topThree[2].xp} XP</p>
            </motion.div>
          )}
        </div>

        {/* The Rest of the Leaderboard */}
        <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
          {others.map((user, idx) => (
            <Link href={`/profile/${user._id}`} key={user._id}>
              <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * idx }}
                className="flex items-center p-4 sm:p-6 border-b border-black/5 hover:bg-black/5 transition-colors cursor-pointer group"
              >
                <div className="w-8 font-black text-secondary text-lg group-hover:text-primary transition-colors">
                  {idx + 4}
                </div>
                
                <img src={user.profilePhoto || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-black/10 shadow-sm mr-4 object-cover" />
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-primary text-lg truncate group-hover:underline">{user.name}</h4>
                  <div className="flex items-center space-x-3 text-xs sm:text-sm text-secondary font-medium mt-1">
                    {user.location && (
                      <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {user.location}</span>
                    )}
                    <span className="flex items-center text-yellow-600"><Star className="w-3 h-3 mr-1 fill-yellow-500" /> {user.rating} ({user.reviewCount})</span>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                    <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                    <span className="font-black text-primary text-lg">Lvl {user.level}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-secondary mt-1">{user.xp} XP</p>
                </div>
              </motion.div>
            </Link>
          ))}
          {others.length === 0 && topThree.length === 0 && (
            <div className="p-10 text-center text-secondary font-medium">No users found on the leaderboard.</div>
          )}
        </div>

      </motion.div>
    </div>
  );
}
