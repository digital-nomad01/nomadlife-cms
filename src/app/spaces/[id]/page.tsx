"use client";
import { use } from "react";
import { useRouter } from "next/navigation";
import SpaceForm from "@/features/spaces/ui/space-form";

interface PageProps { params: Promise<{ id: string }> }

export default function SpaceDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const handleSuccess = () => {
    router.push("/spaces");
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Edit Space</h1>
      <SpaceForm spaceId={id} onSuccess={handleSuccess} />
    </div>
  );
}


