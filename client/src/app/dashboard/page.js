"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { LayoutDashboard, Users, Calendar, Activity, Settings, User, Check, Star } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const { user, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [swaps, setSwaps] = useState([]);

  useEffect(() => {
    checkAuth();
    if (!localStorage.getItem('token')) {
      router.push('/login');
    } else {
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/swaps/my-requests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const response = await res.json();
        if (response.success) {
          setSwaps(response.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-pulse w-12 h-12 bg-primary rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 leading-tight">{user?.name || 'User'}</h3>
                <p className="text-sm text-gray-500">Skill Swapper</p>
              </div>
            </div>

            <nav className="space-y-2">
              <Link href="/dashboard" className="flex items-center px-4 py-3 bg-primary text-white font-medium rounded-xl shadow-sm transition-all">
                <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
              </Link>
              <Link href="/matches" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary font-medium rounded-xl transition-all">
                <Users className="w-5 h-5 mr-3" /> My Matches
              </Link>
              <Link href="/requests" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary font-medium rounded-xl transition-all">
                <Calendar className="w-5 h-5 mr-3" /> Requests
              </Link>
              <Link href={`/profile/${user?._id}`} className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary font-medium rounded-xl transition-all">
                <Settings className="w-5 h-5 mr-3" /> Profile Settings
              </Link>
            </nav>
          </motion.div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow space-y-6 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
            <p className="text-gray-500">Welcome back, let's see what's happening.</p>
          </motion.div>

          {/* Grid Layout Placeholder for Push 2, 3, 4 */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Left Column (Stats & Upcoming) */}
            <div className="xl:col-span-2 space-y-6">
              {/* Push 2: Stats Component */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-md text-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-blue-100 font-medium">Total Swaps</p>
                      <h3 className="text-3xl font-bold mt-1">{swaps.filter(s => s.status === 'completed' || s.status === 'accepted').length}</h3>
                    </div>
                    <div className="bg-white/20 p-2 rounded-xl">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-blue-100">+2 this week</p>
                </motion.div>
                
                <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-md text-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-purple-100 font-medium">Hours Learned</p>
                      <h3 className="text-3xl font-bold mt-1">45.5</h3>
                    </div>
                    <div className="bg-white/20 p-2 rounded-xl">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-purple-100">+5 hrs this month</p>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-[#dd6b20] to-orange-600 rounded-2xl p-6 shadow-md text-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-orange-100 font-medium">Profile Rating</p>
                      <h3 className="text-3xl font-bold mt-1">4.9</h3>
                    </div>
                    <div className="bg-white/20 p-2 rounded-xl">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-orange-100">Top 5% of users</p>
                </motion.div>
              </div>

              {/* Push 6: Upcoming Scheduled Swaps */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Upcoming Scheduled Swaps</h2>
                  <Link href="/requests" className="text-sm text-primary font-bold hover:underline">View All</Link>
                </div>
                
                <div className="space-y-4">
                  {swaps.filter(s => s.status === 'ACCEPTED' && s.scheduledDate).length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-bold text-gray-900">No scheduled swaps</h3>
                      <p className="text-gray-500 text-sm mt-1 mb-4">You have no upcoming sessions on the calendar.</p>
                      <Link href="/requests" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#152843] transition-colors">
                        Schedule a Session
                      </Link>
                    </div>
                  ) : (
                    swaps.filter(s => s.status === 'ACCEPTED' && s.scheduledDate)
                      .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
                      .map((swap) => {
                        const otherUser = swap.senderId._id === user?._id ? swap.receiverId : swap.senderId;
                        const dateObj = new Date(swap.scheduledDate);
                        const isToday = dateObj.toDateString() === new Date().toDateString();

                        return (
                          <motion.div key={swap._id} whileHover={{ scale: 1.01 }} className="flex flex-col sm:flex-row sm:items-center p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-all group gap-4">
                            <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center flex-shrink-0 shadow-sm border ${isToday ? 'bg-primary border-primary text-white' : 'bg-primary/5 border-primary/20 text-primary'}`}>
                              <span className="text-xs font-bold uppercase">{dateObj.toLocaleString('en-US', { month: 'short' })}</span>
                              <span className="text-lg font-black leading-none">{dateObj.getDate()}</span>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-bold text-gray-900 text-lg">{otherUser.name}</h4>
                                {isToday && <span className="bg-red-50 text-red-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-red-100">Today</span>}
                              </div>
                              <p className="text-sm text-gray-500 font-medium mb-1">
                                {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {swap.duration} mins
                              </p>
                              <p className="text-xs text-gray-400 truncate max-w-xs md:max-w-md">Focus: {swap.offeredSkills[0]} & {swap.requestedSkills[0]}</p>
                            </div>

                            <div className="flex-shrink-0">
                              {swap.meetingLink ? (
                                <a href={swap.meetingLink} target="_blank" rel="noreferrer" className="inline-block w-full text-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm transition-colors">
                                  Join Room
                                </a>
                              ) : (
                                <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-md">No Link</span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (Activity Feed) */}
            <div className="space-y-6">
              {/* Push 4: Activity Feed */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                </div>
                
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                  {[
                    { title: 'New match found!', desc: 'Sarah matches 95% of your skills.', time: '2 hours ago', icon: <Users className="w-4 h-4 text-white" />, color: 'bg-blue-500' },
                    { title: 'Swap completed', desc: 'You completed a 1hr swap with John.', time: 'Yesterday', icon: <Check className="w-4 h-4 text-white" />, color: 'bg-green-500' },
                    { title: 'Earned a badge', desc: 'You unlocked the "Top Teacher" badge!', time: '3 days ago', icon: <Star className="w-4 h-4 text-white" />, color: 'bg-orange-500' },
                    { title: 'Profile updated', desc: 'You added "Python" to your offered skills.', time: '1 week ago', icon: <Settings className="w-4 h-4 text-white" />, color: 'bg-gray-500' }
                  ].map((act, i) => (
                    <div key={i} className="relative flex items-start gap-4 group">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 shadow-sm ${act.color} z-10`}>
                        {act.icon}
                      </div>
                      
                      <div className="flex-1 p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-2 xl:mb-1 gap-1">
                          <h4 className="font-bold text-gray-900 text-sm">{act.title}</h4>
                          <time className="text-xs text-gray-400 font-medium whitespace-nowrap">{act.time}</time>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{act.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
