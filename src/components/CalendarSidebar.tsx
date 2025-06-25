import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event } from '@/pages/Index';

interface CalendarSidebarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  events: Event[];
}

export const CalendarSidebar = ({ selectedDate, setSelectedDate, events }: CalendarSidebarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstWeekday = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const navigate = (dir: 'prev' | 'next') => {
    const nm = new Date(currentMonth);
    nm.setMonth(nm.getMonth() + (dir === 'next' ? 1 : -1));
    setCurrentMonth(nm);
  };

  const hasEvent = (d: Date) => events.some(e => e.date.toDateString() === d.toDateString());
  const upcoming = events.find(e => {
    const now = new Date(), in7 = new Date(now.valueOf() + 7*24*60*60000);
    return e.date >= now && e.date <= in7;
  });

  return (
    <aside className="w-80 h-full flex flex-col bg-white border-r shadow-sm">
      

      <div className="px-6 py-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => navigate('prev')}>
              <ChevronLeft size={16} />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => navigate('next')}>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-xs text-zinc-400 mb-1">
          {weekdays.map(d => <div key={d} className="text-center">{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({length: firstWeekday}).map((_,i)=> <div key={i} className="h-8"/>)}
          {Array.from({length: daysInMonth}, (_,i)=>{
            const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i+1);
            const today = new Date().toDateString() === d.toDateString();
            const selected = selectedDate.toDateString() === d.toDateString();
            return (
              <button
                key={i}
                onClick={()=>setSelectedDate(d)}
                className={`
                  relative h-8 w-8 flex-center rounded-full
                  ${selected ? 'bg-black text-white' : today ? 'bg-zinc-100 text-black' : 'hover:bg-zinc-100 text-zinc-700'}
                `}
              >
                {i+1}
                {hasEvent(d) && <span className="absolute bottom-0 w-1 h-1 bg-zinc-500 rounded-full" />}
              </button>
            );
          })}
        </div>
      </div>

      {upcoming && (
        <div className="px-6 py-4 border-b">
          <div className="flex items-start gap-3 bg-zinc-50 border p-4 rounded-lg">
            <Calendar size={18} className="text-zinc-500 mt-1" />
            <div>
              <p className="font-medium">{upcoming.title}</p>
              <p className="text-sm text-zinc-500">
                {upcoming.date.toLocaleDateString()} @ {upcoming.time}
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="text-xs">Later</Button>
                <Button size="sm" className="bg-black text-white text-xs">Details</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 py-4 border-b">
        <h4 className="font-medium text-sm mb-2">My Calendars</h4>
        <ul className="space-y-2 text-sm text-zinc-700">
          {[
            {label:'Antonio', color:'bg-black', count:8},
            {label:'Tasks', color:'bg-gray-600'},
            {label:'Birthdays', color:'bg-gray-400', count:2}
          ].map(c=>(
            <li key={c.label} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${c.color}`} />
                {c.label}
              </div>
              {c.count && <span className="text-xs bg-zinc-100 px-2 py-0.5 rounded">{c.count}</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="px-6 py-4 flex-1 overflow-y-auto">
        <h4 className="font-medium text-sm mb-2">Categories</h4>
        <ul className="space-y-4">
          {[
            {label:'Personal', color:'bg-gray-400', pct:75},
            {label:'Work', color:'bg-gray-600', pct:50},
            {label:'Health', color:'bg-black', pct:66}
          ].map(cat=>(
            <li key={cat.label}>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${cat.color}`} />
                  {cat.label}
                </div>
                <span className="text-xs text-zinc-500">{cat.pct}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-200 rounded-full mt-1">
                <div className={`${cat.color} h-full`} style={{width:`${cat.pct}%`}}/>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
);
};
