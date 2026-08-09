"use client";

import { useCalendarStore } from '@/store/useCalendarStore';
import { useAuthStore } from '@/store/useAuthStore';
import { format, isToday, isFuture } from 'date-fns';
import { Video, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UpcomingSessions({ onSessionClick }) {
  const { sessions } = useCalendarStore();
  const { user } = useAuthStore();

  const futureSessions = sessions
    .filter(s => s.scheduledDate && (isFuture(new Date(s.scheduledDate)) || isToday(new Date(s.scheduledDate))))
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  if (futureSessions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Upcoming Sessions</h3>
        <div className="text-center py-6">
          <CalendarIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500 font-medium">No sessions scheduled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-4">Upcoming Sessions</h3>
      
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {futureSessions.map((session) => {
          const otherUser = session.senderId._id === user?._id ? session.receiverId : session.senderId;
          const dateObj = new Date(session.scheduledDate);
          const today = isToday(dateObj);

          return (
            <motion.div
              key={session._id}
              whileHover={{ scale: 1.02 }}
              onClick={() => onSessionClick(session)}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${today ? 'border-primary/30 bg-primary/5' : 'border-gray-100 hover:border-primary/20 hover:bg-gray-50'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm truncate max-w-[120px]">{otherUser.name}</h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {format(dateObj, 'MMM d, h:mm a')}
                  </p>
                </div>
                {today && (
                  <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                    Today
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100/50">
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                  {session.duration || 60} min
                </span>
                {session.meetingLink && (
                  <div className="flex items-center text-blue-500 text-xs font-bold hover:text-blue-600 transition-colors">
                    <Video className="w-3 h-3 mr-1" /> Join
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
