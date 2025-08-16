import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, Users, Check } from "lucide-react";
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

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: string;
  status: string;
  assignedTo?: string;
}

interface CalendarItem {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'event' | 'task';
  department?: string;
  location?: string;
  attendees?: number;
  priority?: string;
  status?: string;
}

interface CalendarProps {
  events: Event[];
  tasks?: Task[];
  isFounder?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({ events = [], tasks = [], isFounder = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);

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

  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-gradient-to-r from-red-500 to-red-600';
      case 'high': return 'bg-gradient-to-r from-orange-500 to-orange-600';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 'low': return 'bg-gradient-to-r from-green-500 to-green-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
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

  // Combine events and tasks into calendar items
  const calendarItems: CalendarItem[] = [
    ...events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      type: 'event' as const,
      department: event.department,
      location: event.location,
      attendees: event.attendees
    })),
    ...tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      date: task.dueDate,
      type: 'task' as const,
      priority: task.priority,
      status: task.status
    }))
  ];

  const getItemsForDate = (date: Date) => {
    return calendarItems.filter(item => item?.date && isSameDay(new Date(item.date), date));
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

              const dayItems = getItemsForDate(day);
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
                    {dayItems.slice(0, 2).map(item => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`w-full text-left text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity ${
                          item.type === 'event' 
                            ? `${getDepartmentColor(item.department || '')} text-white`
                            : item.status === 'completed'
                              ? 'bg-gray-400 text-white'
                              : `${getTaskPriorityColor(item.priority || '')} text-white`
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {item.type === 'task' ? (
                            item.status === 'completed' ? (
                              <Check className="h-3 w-3 flex-shrink-0" />
                            ) : (
                              <span>📋</span>
                            )
                          ) : (
                            <span>📅</span>
                          )}
                          <span className="truncate">{item.title}</span>
                        </div>
                      </div>
                    ))}
                    {dayItems.length > 2 && (
                      <div className="text-xs text-gray-500 font-medium">
                        +{dayItems.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Item Details Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {selectedItem?.type === 'event' ? 'Event Details' : 'Task Details'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{selectedItem.title}</h3>
                <p className="text-gray-600">{selectedItem.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {selectedItem.type === 'event' 
                      ? format(selectedItem.date, 'EEEE, MMMM d, yyyy')
                      : `Due: ${format(selectedItem.date, 'EEEE, MMMM d, yyyy')}`
                    }
                  </span>
                </div>

                {selectedItem.type === 'event' && selectedItem.department && (
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-gray-500" />
                    <Badge className={`${getDepartmentColor(selectedItem.department)} text-white px-3 py-1`}>
                      {formatDepartmentName(selectedItem.department)}
                    </Badge>
                  </div>
                )}

                {selectedItem.type === 'task' && selectedItem.priority && (
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 text-gray-500">🔥</div>
                    <Badge className={`${getTaskPriorityColor(selectedItem.priority)} text-white px-3 py-1`}>
                      {selectedItem.priority.toUpperCase()} Priority
                    </Badge>
                  </div>
                )}

                {selectedItem.type === 'task' && selectedItem.status && (
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 text-gray-500">📊</div>
                    <Badge className={`${
                      selectedItem.status === 'completed' ? 'bg-green-500' :
                      selectedItem.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-500'
                    } text-white px-3 py-1`}>
                      {selectedItem.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                )}

                {selectedItem.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{selectedItem.location}</span>
                  </div>
                )}

                {selectedItem.attendees && (
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {selectedItem.attendees} expected attendees
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