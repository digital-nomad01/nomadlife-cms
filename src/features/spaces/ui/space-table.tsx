"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSpace, type SpaceRow } from "./use-space";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { AmenityBadge } from "./amenity-display";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

const SpaceTable = () => {
  const router = useRouter();
  const { listSpaces, deleteSpace, isLoading } = useSpace();
  const [rows, setRows] = useState<SpaceRow[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    space: SpaceRow | null;
  }>({ open: false, space: null });

  useEffect(() => {
    (async () => {
      const data = await listSpaces();
      if (data) setRows(data);
    })();
  }, [listSpaces]);

  const handleEdit = (id?: string) => {
    if (id) router.push(`/spaces/${id}`);
  };

  const openDeleteDialog = (space: SpaceRow) => {
    setDeleteDialog({ open: true, space });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, space: null });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.space?.id) return;
    const ok = await deleteSpace(deleteDialog.space.id);
    if (ok) {
      setRows((prev) => prev.filter((r) => r.id !== deleteDialog.space?.id));
      closeDeleteDialog();
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-left">
          <thead className="bg-neutral-50">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Location</th>
              <th className="p-3">Amenities</th>
              <th className="p-3">Capacity</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">
                  {r.image ? (
                    <Image 
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/spaces/${r.image}`} 
                      alt={r.name} 
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded-full" 
                    />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-gray-500" />
                  )}
                </td>
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3">{r.space_type.replace("_", " ")}</td>
                <td className="p-3">{r.location}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {r.amenities && r.amenities.length > 0 ? (
                      r.amenities.slice(0, 3).map((amenity) => (
                        <AmenityBadge key={amenity} amenityName={amenity} />
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No amenities</span>
                    )}
                    {r.amenities && r.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{r.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </td>
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
                <td className="p-6 text-center text-neutral-500" colSpan={8}>No spaces yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={deleteDialog.open} onOpenChange={closeDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Space</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteDialog.space?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Space
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpaceTable;


