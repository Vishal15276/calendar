import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Event } from '@/pages/Index';

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  selectedDate: Date;
}

export const AddEventDialog = ({
  open,
  onOpenChange,
  onAddEvent,
  selectedDate
}: AddEventDialogProps) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [category, setCategory] = useState<'personal' | 'work' | 'health'>('work');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddEvent({
      title: title.trim(),
      time,
      endTime,
      date: selectedDate,
      category,
      location: location.trim() || undefined,
      description: description.trim() || undefined
    });

    setTitle('');
    setTime('09:00');
    setEndTime('10:00');
    setCategory('work');
    setLocation('');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-2xl max-w-lg p-8 space-y-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-white">
            🗓️ Add New Event
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-medium">Event Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Team meeting"
              className="rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">Start Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="rounded-xl shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="rounded-xl shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(val: 'personal' | 'work' | 'health') => setCategory(val)}>
              <SelectTrigger className="rounded-xl shadow-sm">
                <SelectValue placeholder="Choose category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="work">💼 Work</SelectItem>
                <SelectItem value="personal">🏠 Personal</SelectItem>
                <SelectItem value="health">💪 Health</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Optional location"
              className="rounded-xl shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details about the event"
              className="rounded-xl shadow-sm min-h-[90px]"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-zinc-300 text-zinc-600 hover:bg-zinc-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            >
              ➕ Add Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );  
};
