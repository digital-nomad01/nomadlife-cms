"use client";
import { useEffect, useState } from "react";
import { FormBuilder } from "@/app/core/form-builder";
import { eventFields } from "@/features/events/domain/event-fields";
import { eventSchema, type EventInput } from "@/features/events/domain/event-schema";
import { useEvent, type EventRow } from "./use-event";

interface EventFormProps {
  eventId?: string;
  onSuccess?: () => void;
}

const EventForm = ({ eventId, onSuccess }: EventFormProps) => {
  const { handleSubmit, isLoading, getEvent, updateEvent } = useEvent();
  const [eventData, setEventData] = useState<EventRow | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (eventId) {
      setIsEdit(true);
      getEvent(eventId).then((data) => {
        if (data) setEventData(data);
      });
    }
  }, [eventId]);

  const handleFormSubmit = async (data: EventInput) => {
    if (isEdit && eventId) {
      const result = await updateEvent(eventId, {
        title: data.title,
        description: data.description,
        content: data.content ?? null,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date ? data.end_date.toISOString() : null,
        location: data.location,
        venue: data.venue ?? null,
        capacity: data.capacity ?? null,
        price: data.price ?? null,
        status: data.status,
        tags: data.tags ?? [],
        is_online: data.is_online ?? false,
      });
      if (result && onSuccess) onSuccess();
    } else {
      await handleSubmit(data);
      if (onSuccess) onSuccess();
    }
  };

  const getDefaultValues = () => {
    if (eventData) {
      return {
        title: eventData.title,
        description: eventData.description,
        content: eventData.content || "",
        start_date: new Date(eventData.start_date),
        end_date: eventData.end_date ? new Date(eventData.end_date) : undefined,
        location: eventData.location,
        venue: eventData.venue || "",
        capacity: eventData.capacity || 0,
        price: eventData.price || 0,
        status: eventData.status,
        tags: eventData.tags || [],
        image: undefined, // File inputs can't be pre-filled
        is_online: eventData.is_online || false,
      };
    }
    
    return {
      title: "",
      description: "",
      content: "",
      start_date: undefined,
      end_date: undefined,
      location: "",
      venue: "",
      capacity: 0,
      price: 0,
      status: "draft" as const,
      tags: [],
      image: undefined,
      is_online: false,
    };
  };

  // Show loading while fetching event data for edit
  if (isEdit && !eventData && isLoading) {
    return (
      <div className="w-full max-w-2xl">
        <div className="p-8 text-center">Loading event data...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <FormBuilder
        fields={eventFields}
        schema={eventSchema}
        onSubmit={handleFormSubmit}
        submitButtonText={
          isLoading 
            ? (isEdit ? "Updating..." : "Creating...") 
            : (isEdit ? "Update Event" : "Create Event")
        }
        defaultValues={getDefaultValues()}
      />
    </div>
  );
};

export default EventForm;


