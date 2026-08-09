"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { Menu, X, Code2, LogOut, User, Sparkles, Map, Trophy, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout, checkAuth } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const isActive = (path) => pathname === path;

  return (
    <nav className="fixed w-full z-[100] bg-white/90 backdrop-blur-xl border-b border-black/5 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-2"
            >
              <Code2 className="text-primary w-8 h-8" />
              <span className="font-bold text-xl text-primary tracking-tight">SkillSwap</span>
            </motion.div>
          </Link>

            <div className="hidden md:flex items-center gap-2">
              <Link 
                href="/explore" 
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive('/explore') ? 'bg-primary text-white shadow-sm' : 'text-secondary hover:text-primary hover:bg-black/5'}`}
              >
                Explore
              </Link>

              {/* Features Dropdown */}
              <div className="relative group">
                <button className="px-4 py-2 rounded-xl text-sm font-bold transition-all text-secondary hover:text-primary hover:bg-black/5 flex items-center gap-1 cursor-pointer">
                  Features <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[200] overflow-hidden py-2">
                  <Link 
                    href="/matches" 
                    className={`block px-4 py-2.5 text-sm font-bold transition-all flex items-center ${isActive('/matches') ? 'bg-primary/5 text-primary' : 'text-secondary hover:bg-gray-50 hover:text-primary'}`}
                  >
                    <Sparkles className="w-4 h-4 mr-2" /> AI Match
                  </Link>
                  <Link 
                    href="/roadmap" 
                    className={`block px-4 py-2.5 text-sm font-bold transition-all flex items-center ${isActive('/roadmap') ? 'bg-primary/5 text-primary' : 'text-secondary hover:bg-gray-50 hover:text-primary'}`}
                  >
                    <Map className="w-4 h-4 mr-2" /> Roadmap
                  </Link>
                  <Link 
                    href="/reputation" 
                    className={`block px-4 py-2.5 text-sm font-bold transition-all flex items-center ${isActive('/reputation') ? 'bg-primary/5 text-primary' : 'text-secondary hover:bg-gray-50 hover:text-primary'}`}
                  >
                    <Trophy className="w-4 h-4 mr-2" /> Reputation
                  </Link>
                  <Link 
                    href="/leaderboard" 
                    className={`block px-4 py-2.5 text-sm font-bold transition-all flex items-center ${isActive('/leaderboard') ? 'bg-yellow-50 text-yellow-700' : 'text-secondary hover:bg-yellow-50 hover:text-yellow-600'}`}
                  >
                    <Trophy className="w-4 h-4 mr-2" /> Leaderboard
                  </Link>
                </div>
              </div>

              {isAuthenticated ? (
              <div className="flex items-center gap-6 ml-4">
                {user?.role === 'ADMIN' && (
                  <Link href="/admin" className="text-red-500 font-bold hover:text-red-600 transition-colors">
                    Admin Panel
                  </Link>
                )}
                <Link href="/requests" className="text-secondary hover:text-primary font-medium transition-colors relative">
                  Requests
                  <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </Link>
                <Link href="/calendar" className="text-secondary hover:text-primary font-medium transition-colors">
                  Calendar
                </Link>
                <Link href="/dashboard">
                  <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-1 text-secondary hover:text-primary font-medium transition-colors">
                    <User className="w-5 h-5" />
                    <span>{user?.name}</span>
                  </motion.div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={logout}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600 font-medium transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link href="/login" className="text-secondary hover:text-primary font-medium transition-colors">
                  Login
                </Link>
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-primary hover:bg-[#152843] text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-primary hover:text-[#152843] p-2 transition-colors">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-black/5 shadow-2xl relative z-40 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-4">
              <Link href="/explore" onClick={() => setIsOpen(false)}>
                <span className="block text-secondary hover:text-primary py-2 font-medium">Explore</span>
              </Link>
              <Link href="/leaderboard" onClick={() => setIsOpen(false)}>
                <span className="block text-yellow-600 hover:text-yellow-700 py-2 font-bold flex items-center"><Trophy className="w-4 h-4 mr-2" /> Leaderboard</span>
              </Link>

              {isAuthenticated ? (
                <>
                  {user?.role === 'ADMIN' && (
                    <Link href="/admin" onClick={() => setIsOpen(false)}>
                      <span className="block text-red-500 font-bold hover:text-red-600 py-2">Admin Panel</span>
                    </Link>
                  )}
                  <Link href="/requests" onClick={() => setIsOpen(false)}>
                    <span className="block text-secondary hover:text-primary py-2 font-medium">Requests</span>
                  </Link>
                  <Link href="/calendar" onClick={() => setIsOpen(false)}>
                    <span className="block text-secondary hover:text-primary py-2 font-medium">Calendar</span>
                  </Link>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <span className="block text-secondary hover:text-primary py-2 font-medium">Dashboard</span>
                  </Link>
                  <button onClick={() => { logout(); setIsOpen(false); }} className="block text-red-500 hover:text-red-600 w-full text-left py-2 font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-4 pt-4 border-t border-black/5">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <span className="block text-secondary hover:text-primary font-medium py-2">Login</span>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <span className="block bg-primary hover:bg-[#152843] text-center rounded-xl py-3 text-white font-semibold transition-all shadow-md">
                      Get Started
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
