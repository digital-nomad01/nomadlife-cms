"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useEvent, type EventRow } from "./use-event";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EventTable = () => {
  const router = useRouter();
  const { listEvents, deleteEvent, isLoading } = useEvent();
  const [rows, setRows] = useState<EventRow[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    event: EventRow | null;
  }>({ open: false, event: null });

  useEffect(() => {
    (async () => {
      const data = await listEvents();
      if (data) setRows(data);
    })();
  }, []); // Remove listEvents dependency to prevent infinite re-rendering

  const handleEdit = (id?: string) => {
    if (id) router.push(`/events/${id}`);
  };

  const openDeleteDialog = (event: EventRow) => {
    setDeleteDialog({ open: true, event });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, event: null });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.event?.id) return;
    
    const ok = await deleteEvent(deleteDialog.event.id);
    if (ok) {
      setRows((prev) => prev.filter((r) => r.id !== deleteDialog.event?.id));
      closeDeleteDialog();
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-left">
          <thead className="bg-neutral-50">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Start</th>
              <th className="p-3">Location</th>
              <th className="p-3">Attendees</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">
                  {r.image ? (
                    <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/events/${r.image}`} alt={r.title} className="w-10 h-10 object-cover rounded-full" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-gray-500" />
                  )}
                </td>
                <td className="p-3 font-medium">{r.title}</td>
                <td className="p-3">{new Date(r.start_date).toLocaleDateString()}</td>
                <td className="p-3">{r.location}</td>
                <td className="p-3">{r.capacity ?? "-"}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    r.status === 'published' ? 'bg-green-100 text-green-800' :
                    r.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(r.id)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(r)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && !isLoading && (
              <tr>
                <td className="p-6 text-center text-neutral-500" colSpan={6}>No events yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={deleteDialog.open} onOpenChange={closeDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.event?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventTable;