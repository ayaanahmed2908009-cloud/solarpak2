import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  ArrowLeft,
  Save,
  CalendarDays
} from "lucide-react";

import { useWorkerAuth } from "@/hooks/useWorkerAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { CreateEventInput } from "@shared/worker-schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventSchema } from "@shared/worker-schema";

export default function CreateEvent() {
  const [, navigate] = useLocation();
  const { worker: currentUser } = useWorkerAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if current user is founder Ayaan Ahmed (admin account)
  const isFounder = currentUser?.username === "admin";

  const createEventMutation = useMutation({
    mutationFn: async (data: CreateEventInput) => {
      const response = await fetch("/worker/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create event");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Event created",
        description: "Event has been created and assigned to selected teams.",
      });
      queryClient.invalidateQueries({ queryKey: ["/worker/api/events"] });
      navigate("/worker/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Creation failed",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    },
  });

  const form = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      department: "",
      status: "planned",
      attendees: "",
      startDate: "",
      endDate: "",
    },
  });

  const handleCreateEvent = async (data: CreateEventInput) => {
    try {
      await createEventMutation.mutateAsync(data);
    } catch (error) {
      // Error handled in mutation onError
    }
  };

  if (currentUser?.role !== "admin" && currentUser?.role !== "manager") {
    navigate("/worker/dashboard");
    return null;
  }

  return (
    <div className={`min-h-screen ${isFounder ? 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50'}`}>
      {/* Header */}
      <div className={`${isFounder ? 'bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600' : 'bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600'} text-white shadow-xl`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                onClick={() => navigate("/worker/dashboard")}
                className="text-white hover:bg-white/20 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className={`text-3xl font-bold bg-gradient-to-r ${isFounder ? 'from-white to-yellow-100' : 'from-white to-blue-100'} bg-clip-text text-transparent`}>
                  {isFounder ? '📅 Create Event' : '📅 Create Event'}
                </h1>
                <p className={`${isFounder ? 'text-yellow-100' : 'text-blue-100'} font-medium`}>
                  {isFounder ? 'Schedule golden gatherings for your team' : 'Schedule meetings and events for your team'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className={`${isFounder ? 'bg-gradient-to-br from-white to-yellow-50 border-yellow-200' : 'bg-gradient-to-br from-white to-blue-50 border-blue-200'} shadow-xl`}>
          <CardHeader className={`${isFounder ? 'bg-gradient-to-r from-yellow-600 to-amber-600' : 'bg-gradient-to-r from-blue-600 to-purple-600'} text-white rounded-t-lg`}>
            <div className="flex items-center">
              <CalendarDays className="h-6 w-6 mr-3" />
              <div>
                <CardTitle className="text-xl">Event Details</CardTitle>
                <CardDescription className={`${isFounder ? 'text-yellow-100' : 'text-blue-100'}`}>
                  Fill in the event information and select teams to invite
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateEvent)} className="space-y-6">
                {/* Event Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-700 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Event Title
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter event title (e.g., Weekly Team Meeting, Project Planning Session)"
                          {...field}
                          className="text-lg py-3 border-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Event Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-700">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the event purpose, agenda, and any preparation needed..."
                          className="min-h-[100px] border-2 focus:ring-2 focus:ring-blue-500"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location and Department Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold text-gray-700 flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          Location
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Meeting room, Zoom link, or address"
                            {...field}
                            value={field.value || ''}
                            className="border-2 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold text-gray-700 flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Invite Teams
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-2 focus:ring-2 focus:ring-blue-500">
                              <SelectValue placeholder="Select teams to invite" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-2"></div>
                                All Teams
                              </div>
                            </SelectItem>
                            <SelectItem value="events">
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mr-2"></div>
                                Events & Community Outreach
                              </div>
                            </SelectItem>
                            <SelectItem value="social-media">
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mr-2"></div>
                                Social Media
                              </div>
                            </SelectItem>
                            <SelectItem value="sponsorships">
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-2"></div>
                                Sponsorships & Fundraising
                              </div>
                            </SelectItem>
                            <SelectItem value="healthcare">
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mr-2"></div>
                                Predictive Systems & Healthcare
                              </div>
                            </SelectItem>
                            <SelectItem value="management">
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mr-2"></div>
                                Management
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Date and Time Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold text-gray-700 flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          Start Date & Time
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local"
                            {...field}
                            value={field.value || ''}
                            className="border-2 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold text-gray-700">
                          End Date & Time (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local"
                            {...field}
                            value={field.value || ''}
                            className="border-2 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Expected Attendees */}
                <FormField
                  control={form.control}
                  name="attendees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-700">
                        Expected Attendees (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Estimated number of attendees"
                          {...field}
                          value={field.value || ''}
                          className="border-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/worker/dashboard")}
                    className="flex-1 py-3 text-lg border-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createEventMutation.isPending}
                    className={`flex-1 py-3 text-lg ${isFounder ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600' : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'} text-white shadow-lg`}
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {createEventMutation.isPending ? "Creating..." : "Create Event"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="mt-6 bg-white shadow-lg border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Team Assignment Info</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  When you create an event, it will automatically appear on the calendars of all team members in the selected department(s). 
                  If you select "All Teams", the event will be visible to everyone in the organization.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}