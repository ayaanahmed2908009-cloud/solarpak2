import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, Users } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  department: string;
  location?: string;
  attendees?: number;
}

interface CalendarProps {
  events: Event[];
  isFounder?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({ events = [], isFounder = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'social-media': return 'bg-gradient-to-r from-pink-500 to-rose-500';
      case 'events': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'sponsorships': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'healthcare': return 'bg-gradient-to-r from-purple-500 to-indigo-500';
      case 'management': return 'bg-gradient-to-r from-orange-500 to-yellow-500';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  const formatDepartmentName = (department: string) => {
    switch (department) {
      case 'events': return 'Events & Community Outreach';
      case 'social-media': return 'Social Media';
      case 'sponsorships': return 'Sponsorships & Fundraising';
      case 'healthcare': return 'Predictive Systems & Healthcare';
      case 'management': return 'Management';
      default: return department;
    }
  };

  const getEventsForDate = (date: Date) => {
    if (!events || !Array.isArray(events)) return [];
    return events.filter(event => event?.date && isSameDay(new Date(event.date), date));
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Generate calendar grid (6 weeks)
  const calendarGrid: (Date | null)[] = [];
  const firstDayOfWeek = monthStart.getDay();
  
  // Add empty cells for days before the month starts
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarGrid.push(null);
  }
  
  // Add all days of the month
  daysInMonth.forEach(day => {
    calendarGrid.push(day);
  });

  // Fill remaining cells to complete the 6x7 grid
  while (calendarGrid.length < 42) {
    calendarGrid.push(null);
  }

  return (
    <>
      <Card className={`${isFounder ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'} shadow-xl`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className={`text-xl font-bold ${isFounder ? 'text-yellow-800' : 'text-blue-800'} flex items-center gap-2`}>
              <CalendarIcon className="h-5 w-5" />
              {isFounder ? '⭐ Event Calendar' : '📅 Event Calendar'}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={prevMonth}
                className={`${isFounder ? 'hover:bg-yellow-100' : 'hover:bg-blue-100'}`}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className={`font-semibold text-lg ${isFounder ? 'text-yellow-800' : 'text-blue-800'} min-w-[140px] text-center`}>
                {format(currentDate, 'MMMM yyyy')}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={nextMonth}
                className={`${isFounder ? 'hover:bg-yellow-100' : 'hover:bg-blue-100'}`}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className={`text-center text-sm font-medium ${isFounder ? 'text-yellow-700' : 'text-blue-700'} py-2`}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarGrid.map((day, index) => {
              if (!day) {
                return <div key={index} className="h-20 p-1"></div>;
              }

              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day?.toISOString() || index}
                  className={`h-20 p-1 border rounded-lg ${
                    isCurrentMonth 
                      ? isToday 
                        ? isFounder ? 'bg-yellow-100 border-yellow-300' : 'bg-blue-100 border-blue-300'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                      : 'bg-gray-50 border-gray-100'
                  } transition-colors`}
                >
                  <div className={`text-sm font-medium ${
                    isCurrentMonth 
                      ? isToday 
                        ? isFounder ? 'text-yellow-800' : 'text-blue-800'
                        : 'text-gray-900'
                      : 'text-gray-400'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1 mt-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className={`w-full text-left text-xs p-1 rounded text-white truncate cursor-pointer ${getDepartmentColor(event.department)} hover:opacity-80 transition-opacity`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 font-medium">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Event Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{selectedEvent.title}</h3>
                <p className="text-gray-600">{selectedEvent.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {format(selectedEvent.date, 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-gray-500" />
                  <Badge className={`${getDepartmentColor(selectedEvent.department)} text-white px-3 py-1`}>
                    {formatDepartmentName(selectedEvent.department)}
                  </Badge>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{selectedEvent.location}</span>
                  </div>
                )}

                {selectedEvent.attendees && (
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {selectedEvent.attendees} expected attendees
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Calendar;