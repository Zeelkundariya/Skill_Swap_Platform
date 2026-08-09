"use client";

import { useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useCalendarStore } from '@/store/useCalendarStore';
import { useAuthStore } from '@/store/useAuthStore';
import { addMinutes, format } from 'date-fns';

export default function CalendarView({ onSessionClick }) {
  const { sessions, rescheduleSession, fetchSessions } = useCalendarStore();
  const { user } = useAuthStore();
  const calendarRef = useRef(null);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Transform sessions into FullCalendar events
  const events = sessions.map((session) => {
    const isCurrentUserSender = session.senderId._id === user?._id;
    const otherUser = isCurrentUserSender ? session.receiverId : session.senderId;
    const start = new Date(session.scheduledDate);
    const end = addMinutes(start, session.duration || 60);

    return {
      id: session._id,
      title: `Meeting w/ ${otherUser.name}`,
      start,
      end,
      extendedProps: {
        session
      },
      backgroundColor: '#1E40AF', // primary color
      borderColor: '#1E40AF',
    };
  });

  const handleEventDrop = async (dropInfo) => {
    const { event } = dropInfo;
    const newStart = event.start;
    const swapId = event.id;
    const session = event.extendedProps.session;
    
    try {
      await rescheduleSession(swapId, newStart, session.duration);
    } catch (e) {
      // Revert the drop visually if API fails
      dropInfo.revert();
    }
  };

  const handleEventClick = (clickInfo) => {
    onSessionClick(clickInfo.event.extendedProps.session);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 calendar-container">
      <style jsx global>{`
        .calendar-container .fc-theme-standard .fc-scrollgrid {
          border: 1px solid #f3f4f6;
          border-radius: 0.75rem;
          overflow: hidden;
        }
        .calendar-container .fc-header-toolbar {
          margin-bottom: 1.5rem !important;
        }
        .calendar-container .fc-button-primary {
          background-color: #1E40AF !important;
          border-color: #1E40AF !important;
          border-radius: 0.5rem;
          text-transform: capitalize;
          font-weight: 600;
          padding: 0.5rem 1rem;
          transition: all 0.2s;
        }
        .calendar-container .fc-button-primary:not(:disabled):active,
        .calendar-container .fc-button-primary:not(:disabled).fc-button-active {
          background-color: #152843 !important;
          border-color: #152843 !important;
        }
        .calendar-container .fc-event {
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          transition: transform 0.1s;
        }
        .calendar-container .fc-event:hover {
          transform: scale(1.02);
          z-index: 10;
        }
        .calendar-container .fc-col-header-cell {
          padding: 0.75rem 0;
          background-color: #f9fafb;
          font-weight: 700;
          color: #374151;
        }
        .calendar-container .fc-daygrid-day-number {
          padding: 0.5rem;
          font-weight: 600;
          color: #4b5563;
        }
        .calendar-container .fc-day-today {
          background-color: #eff6ff !important;
        }
      `}</style>
      
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        editable={true} // enables drag and drop
        droppable={true}
        eventDrop={handleEventDrop}
        eventClick={handleEventClick}
        slotMinTime="06:00:00"
        slotMaxTime="23:00:00"
        allDaySlot={false}
        height="75vh"
        nowIndicator={true}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short'
        }}
      />
    </div>
  );
}
