"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import dynamic from 'next/dynamic';
const CalendarView = dynamic(() => import('@/components/calendar/CalendarView'), { ssr: false });
import AvailabilityManager from '@/components/calendar/AvailabilityManager';
import UpcomingSessions from '@/components/calendar/UpcomingSessions';
import SessionModal from '@/components/calendar/SessionModal';
import { Bell, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CalendarPage() {
  const router = useRouter();
  const { user, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [remindersEnabled, setRemindersEnabled] = useState(false);

  useEffect(() => {
    checkAuth();
    if (!localStorage.getItem('token')) {
      router.push('/login');
    } else {
      setLoading(false);
      
      // Load reminders preference
      const reminders = localStorage.getItem('calendar_reminders');
      if (reminders) setRemindersEnabled(JSON.parse(reminders));
    }
  }, []);

  const handleToggleReminders = () => {
    const newState = !remindersEnabled;
    setRemindersEnabled(newState);
    localStorage.setItem('calendar_reminders', JSON.stringify(newState));
    
    if (newState) {
      // In a real app, we would request Notification.requestPermission() here
      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col xl:flex-row gap-6">
        
        {/* Sidebar (Availability, Upcoming, Reminders) */}
        <aside className="w-full xl:w-80 flex-shrink-0 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                <CalendarIcon className="w-8 h-8 mr-3 text-primary" />
                Calendar
              </h1>
              <p className="text-gray-500 mt-1">Manage your time and sessions.</p>
            </div>
            
            {/* Reminders Toggle */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
              <div className="flex items-center text-gray-900 font-bold">
                <Bell className={`w-5 h-5 mr-3 ${remindersEnabled ? 'text-blue-500' : 'text-gray-400'}`} />
                Session Reminders
              </div>
              <button 
                onClick={handleToggleReminders}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${remindersEnabled ? 'bg-primary' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${remindersEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <AvailabilityManager />
            
            <UpcomingSessions 
              onSessionClick={(session) => setSelectedSession(session)} 
            />
          </motion.div>
        </aside>

        {/* Main Calendar Area */}
        <main className="flex-grow">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CalendarView 
              onSessionClick={(session) => setSelectedSession(session)} 
            />
          </motion.div>
        </main>
      </div>

      {/* Details Modal */}
      <SessionModal 
        session={selectedSession} 
        isOpen={!!selectedSession} 
        onClose={() => setSelectedSession(null)} 
      />
    </div>
  );
}
