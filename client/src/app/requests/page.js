"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { CheckCircle2, XCircle, Clock, Send, Inbox, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('incoming');
  const [feedbackData, setFeedbackData] = useState({ rating: 5, comment: '', showFor: null });
  const [scheduleData, setScheduleData] = useState({ date: '', time: '', duration: 60, showFor: null });
  const [levelUpData, setLevelUpData] = useState(null);
  const { user, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    if (!localStorage.getItem('token')) {
      router.push('/login');
    } else {
      fetchRequests();
    }
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/swaps/my-requests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        const response = await res.json();
        if (response.success) {
          setRequests(response.data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const method = action === 'cancel' ? 'DELETE' : 'PUT';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/swaps/${id}/${action}`, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        fetchRequests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitFeedback = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/swaps/${id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rating: feedbackData.rating, comment: feedbackData.comment })
      });
      if (res.ok) {
        const response = await res.json();
        if (response.success) {
          setFeedbackData({ rating: 5, comment: '', showFor: null });
          fetchRequests();
          
          if (response.data && response.data.gamification) {
            setLevelUpData(response.data.gamification);
            setTimeout(() => setLevelUpData(null), 5000);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSchedule = async (id) => {
    try {
      // Basic date/time parsing
      const scheduledDate = new Date(`${scheduleData.date}T${scheduleData.time}`).toISOString();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/swaps/${id}/schedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ scheduledDate, duration: scheduleData.duration })
      });
      if (res.ok) {
        setScheduleData({ date: '', time: '', duration: 60, showFor: null });
        fetchRequests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex-grow flex items-center justify-center min-h-[calc(100vh-4rem)]"><div className="animate-pulse w-12 h-12 bg-primary rounded-full"></div></div>;
  }

  const incoming = requests.filter(r => r.receiverId?._id === user?._id);
  const outgoing = requests.filter(r => r.senderId?._id === user?._id);

  const displayRequests = activeTab === 'incoming' ? incoming : outgoing;

  return (
    <div className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
        <h1 className="text-3xl font-bold mb-8 text-primary">Swap Requests</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'incoming' ? 'bg-primary text-white shadow-md' : 'bg-white border border-black/10 text-secondary hover:text-primary hover:border-primary/40'}`}
          >
            <Inbox className="w-5 h-5 mr-2" /> Incoming ({incoming.length})
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'outgoing' ? 'bg-primary text-white shadow-md' : 'bg-white border border-black/10 text-secondary hover:text-primary hover:border-primary/40'}`}
          >
            <Send className="w-5 h-5 mr-2" /> Outgoing ({outgoing.length})
          </button>
        </div>

        {/* Requests List */}
        {displayRequests.length === 0 ? (
          <div className="text-center py-20 bg-white border border-black/10 rounded-3xl shadow-sm">
            <h3 className="text-xl font-bold text-secondary">No {activeTab} requests found.</h3>
          </div>
        ) : (
          <div className="space-y-6">
            {displayRequests.map((req, idx) => {
              const otherUser = activeTab === 'incoming' ? req.senderId : req.receiverId;
              if (!otherUser) return null; // Safe guard

              return (
                <motion.div
                  key={req._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-black/10 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-primary">{otherUser.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          req.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          req.status === 'ACCEPTED' ? 'bg-green-50 text-green-700 border-green-200' :
                          req.status === 'COMPLETED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      
                      <p className="text-primary/80 mb-4 bg-black/5 p-4 rounded-xl border border-black/10 italic font-medium">
                        "{req.message || 'No message provided'}"
                      </p>

                      <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm mt-4">
                        <div>
                          <strong className="text-primary block mb-2 font-bold">They Offer:</strong>
                          <div className="flex gap-2">{req.offeredSkills.map(s => <span key={s} className="bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-lg text-primary font-bold shadow-sm">{s}</span>)}</div>
                        </div>
                        <div>
                          <strong className="text-primary block mb-2 font-bold">They Want:</strong>
                          <div className="flex gap-2">{req.requestedSkills.map(s => <span key={s} className="bg-black/5 border border-black/10 px-3 py-1.5 rounded-lg text-black/70 font-bold shadow-sm">{s}</span>)}</div>
                        </div>
                      </div>

                      {/* Timeline Progress */}
                      {req.status !== 'REJECTED' && req.status !== 'CANCELLED' && (
                        <div className="mt-8 pt-6 border-t border-black/5 relative z-0 w-full max-w-3xl">
                          <div className="flex justify-between items-center relative">
                            {/* Connecting Line */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-black/5 -translate-y-1/2 -z-10 rounded-full"></div>
                            
                            {/* Dynamic Filled Line */}
                            <div 
                              className="absolute top-1/2 left-0 h-1 bg-accent -translate-y-1/2 -z-10 rounded-full transition-all duration-1000"
                              style={{ 
                                width: req.status === 'PENDING' ? '0%' : 
                                       req.status === 'ACCEPTED' && !req.scheduledDate ? '33%' : 
                                       req.status === 'ACCEPTED' && req.scheduledDate ? '66%' : 
                                       req.status === 'COMPLETED' ? '100%' : '0%' 
                              }}
                            ></div>

                            {[
                              { label: 'Requested', active: true },
                              { label: 'Accepted', active: req.status === 'ACCEPTED' || req.status === 'COMPLETED' },
                              { label: 'Scheduled', active: (req.status === 'ACCEPTED' && req.scheduledDate) || req.status === 'COMPLETED' },
                              { label: 'Completed', active: req.status === 'COMPLETED' }
                            ].map((step, stepIdx) => (
                              <div key={stepIdx} className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-colors ${step.active ? 'bg-accent border-accent-light text-white shadow-md' : 'bg-white border-black/10 text-black/20'}`}>
                                  {step.active ? <Check className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-black/10"></div>}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${step.active ? 'text-primary' : 'text-secondary'}`}>
                                  {step.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-3 min-w-[150px]">
                      {activeTab === 'incoming' && req.status === 'PENDING' && (
                        <>
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleAction(req._id, 'accept')} className="flex items-center justify-center px-4 py-2.5 bg-primary hover:bg-[#152843] text-white font-bold rounded-xl shadow-md transition-all">
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Accept
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleAction(req._id, 'reject')} className="flex items-center justify-center px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold rounded-xl transition-all">
                            <XCircle className="w-4 h-4 mr-2" /> Reject
                          </motion.button>
                        </>
                      )}

                      {activeTab === 'outgoing' && req.status === 'PENDING' && (
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleAction(req._id, 'cancel')} className="flex items-center justify-center px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold rounded-xl transition-all">
                          <XCircle className="w-4 h-4 mr-2" /> Cancel Request
                        </motion.button>
                      )}

                      {req.status === 'ACCEPTED' && (
                        <>
                          {!req.scheduledDate && (
                            <motion.button 
                              whileHover={{ scale: 1.02 }} 
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setScheduleData({...scheduleData, showFor: req._id})}
                              className="flex items-center justify-center px-4 py-2.5 bg-secondary hover:bg-black/80 text-white font-bold rounded-xl shadow-md transition-all mb-2"
                            >
                              <Clock className="w-4 h-4 mr-2" /> Schedule Call
                            </motion.button>
                          )}
                          {req.scheduledDate && (
                            <a href={req.meetingLink} target="_blank" rel="noreferrer" className="flex items-center justify-center px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-md transition-all mb-2">
                              Join Meeting
                            </a>
                          )}
                          <motion.button 
                            whileHover={{ scale: 1.02 }} 
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setFeedbackData({...feedbackData, showFor: req._id})}
                            className="flex items-center justify-center px-4 py-2.5 bg-primary hover:bg-[#152843] text-white font-bold rounded-xl shadow-md transition-all"
                          >
                            <Star className="w-4 h-4 mr-2" /> Complete & Rate
                          </motion.button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Scheduled Info Badge */}
                  {req.scheduledDate && (
                    <div className="mt-4 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
                      <div className="flex items-center text-blue-800">
                        <Clock className="w-5 h-5 mr-3 text-blue-600" />
                        <div>
                          <strong className="block text-sm font-bold">Scheduled Session</strong>
                          <span className="text-sm font-medium">{new Date(req.scheduledDate).toLocaleString()} ({req.duration} mins)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Schedule Form inline */}
                  {scheduleData.showFor === req._id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 pt-6 border-t border-black/10">
                      <h4 className="font-bold mb-4 text-primary">Schedule a Session</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-bold text-secondary mb-1">Date</label>
                          <input type="date" value={scheduleData.date} onChange={e => setScheduleData({...scheduleData, date: e.target.value})} className="w-full bg-black/5 border border-black/10 rounded-xl p-3 text-primary font-bold outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-secondary mb-1">Time</label>
                          <input type="time" value={scheduleData.time} onChange={e => setScheduleData({...scheduleData, time: e.target.value})} className="w-full bg-black/5 border border-black/10 rounded-xl p-3 text-primary font-bold outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-secondary mb-1">Duration (mins)</label>
                          <select value={scheduleData.duration} onChange={e => setScheduleData({...scheduleData, duration: Number(e.target.value)})} className="w-full bg-black/5 border border-black/10 rounded-xl p-3 text-primary font-bold outline-none focus:border-primary">
                            <option value={30}>30 mins</option>
                            <option value={60}>60 mins</option>
                            <option value={90}>90 mins</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button onClick={() => setScheduleData({ date: '', time: '', duration: 60, showFor: null })} className="px-5 py-2.5 font-bold text-secondary hover:text-primary transition-colors">Cancel</button>
                        <button onClick={() => handleSchedule(req._id)} disabled={!scheduleData.date || !scheduleData.time} className="px-5 py-2.5 bg-primary hover:bg-[#152843] text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50">Set Schedule</button>
                      </div>
                    </motion.div>
                  )}

                  {/* Feedback Form inline */}
                  {feedbackData.showFor === req._id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 pt-6 border-t border-black/10">
                      <h4 className="font-bold mb-3 text-primary">Leave Feedback to Complete Swap</h4>
                      <div className="flex items-center space-x-2 mb-3">
                        {[1,2,3,4,5].map(star => (
                          <button key={star} onClick={() => setFeedbackData({...feedbackData, rating: star})}>
                            <Star className={`w-7 h-7 transition-colors ${star <= feedbackData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                      <textarea 
                        className="w-full bg-white border border-black/10 rounded-xl p-4 text-primary font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none mb-3 shadow-sm placeholder:text-black/30"
                        placeholder="How was the swap experience?"
                        value={feedbackData.comment}
                        onChange={(e) => setFeedbackData({...feedbackData, comment: e.target.value})}
                      />
                      <div className="flex justify-end space-x-3">
                        <button onClick={() => setFeedbackData({ rating: 5, comment: '', showFor: null })} className="px-5 py-2.5 font-bold text-secondary hover:text-primary transition-colors">Cancel</button>
                        <button onClick={() => submitFeedback(req._id)} className="px-5 py-2.5 bg-primary hover:bg-[#152843] text-white font-bold rounded-xl shadow-md transition-all">Submit & Complete</button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Gamification Level Up Toast */}
      {levelUpData && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-10 right-10 bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-2xl shadow-2xl z-50 flex items-center gap-4 text-white max-w-sm"
        >
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Star className="w-8 h-8 fill-yellow-200 text-yellow-200" />
          </div>
          <div>
            <h4 className="font-black text-xl">+50 XP Earned!</h4>
            {levelUpData.leveledUp && <p className="font-bold text-yellow-100">You leveled up to Lvl {levelUpData.newLevel}!</p>}
            {levelUpData.newBadges?.length > 0 && <p className="font-bold text-yellow-100 text-sm">New Badge: {levelUpData.newBadges[0]}</p>}
          </div>
        </motion.div>
      )}
    </div>
  );
}
