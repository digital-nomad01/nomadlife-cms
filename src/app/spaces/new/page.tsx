"use client";
import SpaceForm from "@/features/spaces/ui/space-form";

export default function NewSpacePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Create Space</h1>
      <SpaceForm />
    </div>
  );
}


