"use client";
import SpaceTable from "@/features/spaces/ui/space-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SpacesPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Spaces</h1>
        <Link href="/spaces/new">
          <Button>New Space</Button>
        </Link>
      </div>
      <SpaceTable />
    </div>
  );
}


