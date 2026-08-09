"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useCalendarStore } from '@/store/useCalendarStore';
import { Clock, Plus, Trash2, Save, Check } from 'lucide-react';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AvailabilityManager() {
  const { user } = useAuthStore();
  const { updateAvailability } = useCalendarStore();
  const [availability, setAvailability] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (user?.availability) {
      try {
        const parsed = JSON.parse(user.availability);
        setAvailability(parsed);
      } catch (e) {
        console.error('Failed to parse availability', e);
        setAvailability({});
      }
    }
  }, [user]);

  const handleToggleDay = (day) => {
    setAvailability((prev) => {
      const newAvail = { ...prev };
      if (newAvail[day]) {
        delete newAvail[day];
      } else {
        newAvail[day] = [{ start: '09:00', end: '17:00' }];
      }
      return newAvail;
    });
  };

  const handleTimeChange = (day, index, field, value) => {
    setAvailability((prev) => {
      const newAvail = { ...prev };
      newAvail[day][index][field] = value;
      return newAvail;
    });
  };

  const handleAddTimeSlot = (day) => {
    setAvailability((prev) => {
      const newAvail = { ...prev };
      newAvail[day] = [...newAvail[day], { start: '17:00', end: '18:00' }];
      return newAvail;
    });
  };

  const handleRemoveTimeSlot = (day, index) => {
    setAvailability((prev) => {
      const newAvail = { ...prev };
      newAvail[day] = newAvail[day].filter((_, i) => i !== index);
      if (newAvail[day].length === 0) {
        delete newAvail[day];
      }
      return newAvail;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateAvailability(availability);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-primary" />
            Availability
          </h2>
          <p className="text-sm text-gray-500 mt-1">Set the hours you're available for learning sessions.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isSaving}
          className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2 ${showSuccess ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-primary hover:bg-[#152843] text-white'}`}
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : showSuccess ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {showSuccess ? 'Saved!' : 'Save'}
        </motion.button>
      </div>

      <div className="space-y-3">
        {DAYS_OF_WEEK.map((day) => {
          const isActive = !!availability[day];
          
          return (
            <div key={day} className={`border rounded-xl p-3 transition-colors ${isActive ? 'border-primary/20 bg-primary/5' : 'border-gray-100 bg-gray-50/50 hover:bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer select-none">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isActive}
                      onChange={() => handleToggleDay(day)}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-primary' : 'bg-gray-200'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <span className={`ml-3 font-semibold text-sm ${isActive ? 'text-primary' : 'text-gray-500'}`}>{day}</span>
                </label>
                
                {isActive && (
                  <button 
                    onClick={() => handleAddTimeSlot(day)}
                    className="text-xs font-bold text-primary hover:bg-primary/10 px-2 py-1 rounded-md transition-colors flex items-center"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </button>
                )}
              </div>
              
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 space-y-2">
                      {availability[day].map((slot, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="time"
                            value={slot.start}
                            onChange={(e) => handleTimeChange(day, index, 'start', e.target.value)}
                            className="text-sm bg-white border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-primary focus:border-transparent outline-none flex-1"
                          />
                          <span className="text-gray-400 font-medium">-</span>
                          <input
                            type="time"
                            value={slot.end}
                            onChange={(e) => handleTimeChange(day, index, 'end', e.target.value)}
                            className="text-sm bg-white border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-primary focus:border-transparent outline-none flex-1"
                          />
                          <button 
                            onClick={() => handleRemoveTimeSlot(day, index)}
                            className="text-red-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-md transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
