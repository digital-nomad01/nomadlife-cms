"use client";
import EventTable from "@/features/events/ui/event-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Events</h1>
        <Link href="/events/new">
          <Button>New Event</Button>
        </Link>
      </div>
      <EventTable />
    </div>
  );
}


