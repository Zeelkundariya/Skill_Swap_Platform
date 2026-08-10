"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, User, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function Explore() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Popular skills to filter quickly
  const popularSkills = ['React', 'Design', 'Spanish', 'Python', 'Guitar', 'Marketing'];

  const router = useRouter();
  const { checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
    if (!localStorage.getItem('token')) {
      router.push('/login');
    } else {
      searchUsers('');
    }
  }, []);

  const [error, setError] = useState(null);

  const searchUsers = async (searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const url = searchQuery
        ? `http://localhost:5000/api/users/search?skill=${searchQuery}`
        : 'http://localhost:5000/api/users/search';

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(url, { headers });
      if (res.ok) {
        const response = await res.json();
        setUsers(response.data || response);
      } else if (res.status === 401) {
        logout();
        router.push('/login');
      } else {
        setError('Failed to fetch data from the server.');
      }
    } catch (err) {
      setError('Could not connect to the server. Make sure the backend is running.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchUsers(query);
  };

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Skills</h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Discover talented individuals offering the skills you want to learn.
        </p>

        <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-4 bg-surface border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-white text-lg transition-all shadow-lg"
              placeholder="Search for a skill (e.g. React, Spanish)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute inset-y-2 right-2 px-6 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {popularSkills.map(skill => (
            <motion.button
              key={skill}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setQuery(skill); searchUsers(skill); }}
              className="px-4 py-2 glassmorphism rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
            >
              {skill}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex justify-center space-x-2 mt-10 overflow-x-auto pb-4 custom-scrollbar relative z-10">
        {['All Mentors', 'Trending', 'Highly Trusted', 'New Arrivals'].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              tab === 'All Mentors'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-secondary border border-black/5 hover:bg-black/5 hover:text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sorting Control */}
      <div className="flex justify-between items-center mt-6 mb-8 relative z-10">
        <h2 className="text-xl font-bold text-primary">Showing Results</h2>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-black/5 shadow-sm">
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">Sort by:</span>
          <select className="bg-transparent text-sm font-bold text-primary focus:outline-none cursor-pointer">
            <option>Compatibility</option>
            <option>Trust Score</option>
            <option>Experience Level</option>
            <option>Availability</option>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      <div className="relative z-10 min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse w-12 h-12 bg-primary rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-red-500/20 shadow-sm">
            <h3 className="text-2xl font-semibold mb-2 text-red-500">Connection Error</h3>
            <p className="text-secondary">{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-black/5">
            <h3 className="text-2xl font-semibold mb-2 text-primary">No mentors found</h3>
            <p className="text-secondary">Try searching for a different skill.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {users.map((user, i) => {
              // Simulate data for the demo if it doesn't exist
              const trustScore = 85 + (i % 15);
              const rating = (4.5 + (i % 5) * 0.1).toFixed(1);
              
              return (
                <motion.div 
                  key={user._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 hover:shadow-xl transition-all flex flex-col group relative overflow-hidden"
                >
                  {/* Card Background Decoration */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors"></div>

                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden z-10 relative">
                          {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full z-20"></div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors">{user.name}</h3>
                        <div className="flex items-center text-secondary text-xs font-medium mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {user.location || 'Remote (Global)'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Trust Score Badge */}
                    <div className="flex flex-col items-end">
                      <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg flex items-center shadow-sm border border-blue-100">
                        <Star className="w-3 h-3 mr-1 fill-blue-500 text-blue-500" />
                        <span className="text-xs font-black">{rating}</span>
                      </div>
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1">Trust: {trustScore}%</span>
                    </div>
                  </div>

                  <div className="space-y-4 flex-grow relative z-10">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">Can Teach You</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.skillsOffered.slice(0, 3).map(s => (
                          <span key={s} className="px-3 py-1.5 bg-primary/5 rounded-lg text-xs font-bold text-primary border border-primary/10">{s}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">Wants to Learn</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.skillsWanted.slice(0, 3).map(s => (
                          <span key={s} className="px-3 py-1.5 bg-black/5 rounded-lg text-xs font-bold text-secondary border border-black/5">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-black/5 relative z-10">
                    <Link href={`/swap/${user._id}`} className="w-full block">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 bg-primary hover:bg-[#152843] text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex justify-center items-center group/btn"
                      >
                        Request Smart Match <ArrowRight className="w-4 h-4 ml-2 opacity-70 group-hover/btn:opacity-100 transition-all translate-x-0 group-hover/btn:translate-x-1" />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
