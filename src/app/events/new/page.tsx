"use client";
import EventForm from "@/features/events/ui/event-form";

export default function NewEventPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Create Event</h1>
      <EventForm />
    </div>
  );
}


