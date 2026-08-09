"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Clock, Users, Zap, Video } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { format, addMinutes } from 'date-fns';

export default function SessionModal({ session, isOpen, onClose }) {
  const { user } = useAuthStore();

  if (!session) return null;

  const otherUser = session.senderId._id === user?._id ? session.receiverId : session.senderId;
  const startTime = new Date(session.scheduledDate);
  const endTime = addMinutes(startTime, session.duration || 60);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[201] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-[#1a365d] p-6 text-white relative">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4 mt-2">
                <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/50 flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-bold uppercase text-white/80">{format(startTime, 'MMM')}</span>
                  <span className="text-2xl font-black leading-none">{format(startTime, 'dd')}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Learning Session</h2>
                  <p className="text-blue-100 font-medium opacity-90">with {otherUser.name}</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-xs font-bold uppercase tracking-wider">Time</span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {format(startTime, 'h:mm a')}
                  </p>
                  <p className="text-sm text-gray-500">to {format(endTime, 'h:mm a')}</p>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Zap className="w-4 h-4 mr-2" />
                    <span className="text-xs font-bold uppercase tracking-wider">Duration</span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {session.duration || 60} mins
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-6">
                <div>
                  <div className="flex items-center text-gray-500 mb-2">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-xs font-bold uppercase tracking-wider">Skill Focus</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-bold">
                      {session.offeredSkills?.[0]}
                    </span>
                    <span className="text-gray-400 mt-1">↔</span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-bold">
                      {session.requestedSkills?.[0]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                {session.meetingLink ? (
                  <a 
                    href={session.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    <Video className="w-5 h-5" />
                    Join Meeting
                  </a>
                ) : (
                  <button 
                    disabled
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-400 py-3.5 rounded-xl font-bold"
                  >
                    <Video className="w-5 h-5" />
                    Link not available yet
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
