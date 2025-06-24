
import { useState } from 'react';
import { CalendarSidebar } from '@/components/CalendarSidebar';
import { CalendarMain } from '@/components/CalendarMain';
import { EventSidebar } from '@/components/EventSidebar';

export interface Event {
  id: string;
  title: string;
  time: string;
  endTime?: string;
  date: Date;
  category: 'personal' | 'work' | 'health';
  attendees?: string[];
  location?: string;
  description?: string;
}

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventSidebar, setShowEventSidebar] = useState(false);

  // Sample events data
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Meet with Jonson Rider',
      time: '06:00',
      endTime: '07:00',
      date: new Date(2023, 11, 18),
      category: 'work',
      location: 'Park Lane Office',
      attendees: ['Jonson Rider'],
    },
    {
      id: '2',
      title: 'Design onboarding',
      time: '06:00',
      endTime: '07:10',
      date: new Date(2023, 11, 17),
      category: 'work',
    },
    {
      id: '3',
      title: 'Development meet',
      time: '06:00',
      endTime: '08:00',
      date: new Date(2023, 11, 17),
      category: 'work',
    },
    {
      id: '4',
      title: 'Planning tasks',
      time: '07:50',
      endTime: '08:30',
      date: new Date(2023, 11, 17),
      category: 'personal',
    },
  ]);

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent = {
      ...event,
      id: Date.now().toString(),
    };
    setEvents([...events, newEvent]);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100"></div>
      
      <div className="relative z-10 flex h-screen w-full">
        <CalendarSidebar 
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          events={events}
        />
        
        <CalendarMain
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          viewMode={viewMode}
          setViewMode={setViewMode}
          events={events}
          setSelectedEvent={setSelectedEvent}
          setShowEventSidebar={setShowEventSidebar}
          addEvent={addEvent}
        />
        
        {showEventSidebar && selectedEvent && (
          <EventSidebar
            event={selectedEvent}
            onClose={() => setShowEventSidebar(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
