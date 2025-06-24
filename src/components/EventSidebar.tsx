import { X, Clock, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/pages/Index';

interface EventSidebarProps {
  event: Event;
  onClose: () => void;
}

export const EventSidebar = ({ event, onClose }: EventSidebarProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work':
        return 'bg-blue-100 text-blue-700';
      case 'personal':
        return 'bg-green-100 text-green-700';
      case 'health':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-zinc-100 text-zinc-700';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <aside className="w-96 h-full bg-white border-l flex flex-col shadow-lg animate-slideIn">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b">
        <h2 className="text-lg font-semibold text-zinc-900">Event Summary</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-900 transition"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 py-5 overflow-y-auto space-y-6">
        {/* Title and Category */}
        <div>
          <h3 className="text-2xl font-bold text-zinc-900">{event.title}</h3>
          <Badge className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(event.category)}`}>
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </Badge>
        </div>

        {/* Time and Location */}
        <div className="space-y-4 text-sm text-zinc-700">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 mt-0.5 text-zinc-500" />
            <div>
              <div className="font-medium">{formatDate(event.date)}</div>
              <div className="text-zinc-500">
                {event.time} {event.endTime && ` - ${event.endTime}`}
              </div>
            </div>
          </div>

          {event.location && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-0.5 text-zinc-500" />
              <p>{event.location}</p>
            </div>
          )}

          {/* Attendees */}
          {event.attendees?.length > 0 && (
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 mt-0.5 text-zinc-500" />
              <div className="flex-1">
                <p className="font-medium mb-1 text-sm">Attendees</p>
                <div className="flex -space-x-2">
                  {event.attendees.slice(0, 4).map((name, i) => (
                    <div
                      key={i}
                      title={name}
                      className="w-8 h-8 bg-zinc-800 text-white rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold"
                    >
                      {name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  ))}
                  {event.attendees.length > 4 && (
                    <div className="w-8 h-8 bg-zinc-500 text-white rounded-full border-2 border-white flex items-center justify-center text-xs">
                      +{event.attendees.length - 4}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <div>
            <h4 className="text-sm font-semibold text-zinc-800 mb-2">Description</h4>
            <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t space-y-3">
        <Button className="w-full bg-zinc-900 hover:bg-black text-white transition">
          Edit Event
        </Button>
        <Button
          variant="outline"
          className="w-full text-zinc-700 border-zinc-300 hover:bg-zinc-50"
        >
          Duplicate
        </Button>
        <Button
          variant="outline"
          className="w-full border-red-300 text-red-600 hover:bg-red-50"
        >
          Delete
        </Button>
      </div>
    </aside>
  );
};
