  import { useState } from 'react';
  import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import { AddEventDialog } from '@/components/AddEventDialog';
  import { Event } from '@/pages/Index';

  interface CalendarMainProps {
    selectedDate: Date;
    setSelectedDate: (d: Date) => void;
    viewMode: 'month'|'week'|'day';
    setViewMode: (m: 'month'|'week'|'day') => void;
    events: Event[];
    setSelectedEvent: (e: Event) => void;
    setShowEventSidebar: (b: boolean) => void;
    addEvent: (e: Omit<Event,'id'>) => void;
  }

  export const CalendarMain = ({
    selectedDate, setSelectedDate, viewMode, setViewMode,
    events, setSelectedEvent, setShowEventSidebar, addEvent
  }: CalendarMainProps) => {
    const [adding, setAdding] = useState(false);
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    const navigate = (dir: 'prev'|'next') => {
      const nd = new Date(selectedDate);
      if(viewMode==='month') nd.setMonth(nd.getMonth() + (dir==='next'?1:-1));
      else nd.setDate(nd.getDate() + (dir==='next'? (viewMode==='week'?7:1) : (viewMode==='week'? -7 : -1)));
      setSelectedDate(nd);
    };

    const colorClass = (cat:string) => {
      if(cat==='work') return 'bg-blue-600 text-white';
      if(cat==='personal') return 'bg-green-600 text-white';
      if(cat==='health') return 'bg-rose-600 text-white';
      return 'bg-gray-600 text-white';
    };

    const onEvtClick = (e:Event) => {
      setSelectedEvent(e);
      setShowEventSidebar(true);
    };

    // Month View
    const MonthView = () => {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const first = new Date(year, month, 1).getDay();
      const total = Math.ceil((new Date(year, month+1, 0).getDate()+first)/7)*7;
      const cells = Array.from({length: total}, (_,i) => {
        const d = i-first+1;
        return d>0 && d<=new Date(year, month+1, 0).getDate() ? new Date(year,month,d) : null;
      });

      return (
        <div className="grid grid-cols-7 gap-px bg-zinc-200 m-6 rounded-lg overflow-hidden">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(
            <div key={d} className="bg-zinc-100 py-2 text-center text-sm font-medium text-zinc-600">{d}</div>
          ))}
          {cells.map((dt, idx)=>(
            <div
              key={idx}
              onClick={()=>dt && setSelectedDate(dt)}
              className={`
                relative h-32 p-2 bg-white cursor-pointer hover:bg-zinc-50
                ${dt?.toDateString() === selectedDate.toDateString() ? 'ring-2 ring-blue-500 z-10':''}
              `}
            >
              <div className={`absolute top-2 right-2 text-xs font-semibold
                ${dt?.toDateString() === new Date().toDateString()?'text-blue-600':'text-zinc-700'}`}>
                {dt?.getDate()}
              </div>
              <div className="mt-6 space-y-1 overflow-hidden">
                {dt && events.filter(e=>e.date.toDateString()===dt.toDateString()).slice(0,2).map(e=>(
                  <div
                    key={e.id}
                    onClick={ev=>{ev.stopPropagation(); onEvtClick(e);}}
                    className={`truncate text-xs px-2 py-0.5 rounded ${colorClass(e.category)}`}
                  >{e.title}</div>
                ))}
                {dt && events.filter(e=>e.date.toDateString()===dt.toDateString()).length>2 && (
                  <div className="text-xs text-zinc-400">
                    +{events.filter(e=>e.date.toDateString()===dt.toDateString()).length - 2} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    };

    // Week & Day share time grid
    const TimeGrid = ({ days }: {days: Date[]}) => {
      const hours = Array.from({length:24},(_,i)=>i);
      return (
        <div className="flex-1 m-6 shadow-md bg-white rounded-lg overflow-hidden">
          <div className="grid grid-cols-[4rem_repeat(7,1fr)] border-b bg-zinc-100">
            <div className="p-4 text-xs text-zinc-500">Time</div>
            {days.map((d,i)=>(
              <div key={i} className="p-4 text-center border-l text-sm font-medium
                {d.toDateString()===new Date().toDateString()?' text-blue-600':' text-zinc-700'}">
                <div>{d.toLocaleDateString('en-US',{weekday:'short'})}</div>
                <div>{d.getDate()}</div>
              </div>
            ))}
          </div>
          <div className="flex overflow-y-auto max-h-[600px]">
            <div className="w-16 border-r">
              {hours.map(h=>(
                <div key={h} className="h-16 border-b px-2 text-xs text-zinc-500">
                  {h.toString().padStart(2,'0')}:00
                </div>
              ))}
            </div>
            {days.map((d, di)=>(
              <div key={di} className="flex-1 border-r border-zinc-200 relative">
                {hours.map(h=>(
                  <div key={h} className="h-16 border-b relative">
                    {events.filter(e=>e.date.toDateString()===d.toDateString() &&
                      Number(e.time.split(':')[0])===h
                    ).map(e=>(
                      <div
                        key={e.id}
                        onClick={()=>onEvtClick(e)}
                        className={`absolute left-1 right-1 rounded-lg px-2 py-1 text-xs shadow-md cursor-pointer ${colorClass(e.category)}`}
                        style={{
                          top: `${(Number(e.time.split(':')[1]) / 60) * 100}%`,
                          height: e.endTime ?
                            `${((Number(e.endTime.split(':')[0]) - Number(e.time.split(':')[0]))*60 +
                              (Number(e.endTime.split(':')[1]) - Number(e.time.split(':')[1]))
                            ) / 60 * 100}%` : '60%',
                        }}
                      >
                        <div className="font-medium truncate">{e.title}</div>
                        <div className="opacity-80">{e.time}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    };

    const WeekDays = Array.from({length:7},(_,i)=>{
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - d.getDay() + i);
      return d;
    });

    return (
      <main className="flex-1 flex flex-col bg-zinc-50">
        <header className="flex flex-col sm:flex-row justify-between p-6 bg-white border-b gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">
              {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </h1>
            <Button size="icon" variant="ghost" onClick={()=>navigate('prev')}>
              <ChevronLeft size={18} />
            </Button>
            <Button size="icon" variant="ghost" onClick={()=>navigate('next')}>
              <ChevronRight size={18} />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {(['month','week','day'] as const).map(m=>(
              <Button
                key={m}
                size="sm"
                variant={viewMode===m?'default':'ghost'}
                onClick={()=>setViewMode(m)}
              >
                {m.charAt(0).toUpperCase()+m.slice(1)}
              </Button>
            ))}
            <Button size="sm" variant="outline" onClick={()=>setSelectedDate(new Date())}>Today</Button>
            <Button size="sm" onClick={()=>setAdding(true)} className="bg-black text-white flex items-center gap-2">
              <Plus size={16}/> Add
            </Button>
          </div>
        </header>

        {viewMode==='month' && <MonthView />}
        {viewMode==='week' && <TimeGrid days={WeekDays} />}
        {viewMode==='day' && <TimeGrid days={[selectedDate]} />}

        <AddEventDialog
          open={adding}
          onOpenChange={setAdding}
          onAddEvent={addEvent}
          selectedDate={selectedDate}
        />
      </main>
    );
  };
