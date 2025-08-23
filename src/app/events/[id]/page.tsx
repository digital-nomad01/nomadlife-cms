"use client";
import { use } from "react";
import { useRouter } from "next/navigation";
import EventForm from "@/features/events/ui/event-form";

interface PageProps { params: Promise<{ id: string }> }

export default function EventDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const handleSuccess = () => {
    router.push("/events");
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Edit Event</h1>
      <EventForm eventId={id} onSuccess={handleSuccess} />
    </div>
  );
}


