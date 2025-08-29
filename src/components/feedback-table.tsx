"use client";
import { useState, useEffect } from "react";
import { User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";

interface Feedback {
  id: string;
  name: string;
  country: string;
  message: string;
  created_at: string;
  updated_at: string;
}

const FeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    feedback: Feedback | null;
  }>({ open: false, feedback: null });
  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    feedback: Feedback | null;
  }>({ open: false, feedback: null });

  const supabase = createClient();

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          setError(error.message);
          console.error('Error fetching feedbacks:', error);
        } else {
          setFeedbacks(data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error loading feedbacks:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFeedbacks();
  }, [supabase]);

  const deleteFeedback = async (id: string) => {
    try {
      const { error } = await supabase
        .from('feedbacks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting feedback:', error);
        setError(error.message);
      } else {
        setFeedbacks((prev) => prev.filter((f) => f.id !== id));
        closeDeleteDialog();
      }
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const openDeleteDialog = (feedback: Feedback) => {
    setDeleteDialog({ open: true, feedback });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, feedback: null });
  };

  const openViewDialog = (feedback: Feedback) => {
    setViewDialog({ open: true, feedback });
  };

  const closeViewDialog = () => {
    setViewDialog({ open: false, feedback: null });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const truncateMessage = (message: string, length = 100) => {
    return message.length > length ? message.substring(0, length) + "..." : message;
  };

  if (loading) {
    return (
      <div className="w-full p-8 text-center">
        <div className="text-gray-500">Loading feedback...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center">
        <div className="text-red-500">Error loading feedback: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        {/* <h2 className="text-xl font-semibold text-gray-900">Customer Feedback</h2> */}
        <p className="text-gray-600">{feedbacks.length} feedback entries</p>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-left">
          <thead className="bg-neutral-50">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Country</th>
              <th className="p-3">Message</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => (
              <tr key={feedback.id} className="border-t">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium">{feedback.name}</span>
                  </div>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    {feedback.country}
                  </span>
                </td>
                <td className="p-3 max-w-xs">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      {truncateMessage(feedback.message)}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-sm text-gray-500">
                  {formatDate(feedback.created_at)}
                </td>
                <td className="p-3 text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openViewDialog(feedback)}>
                    View
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(feedback)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {feedbacks.length === 0 && (
              <tr>
                <td className="p-6 text-center text-neutral-500" colSpan={5}>
                  No feedback available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Feedback Dialog */}
      <Dialog open={viewDialog.open} onOpenChange={closeViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
            <DialogDescription>
              Feedback from {viewDialog.feedback?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-gray-900">{viewDialog.feedback?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Country</label>
              <p className="mt-1 text-gray-900">{viewDialog.feedback?.country}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Message</label>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {viewDialog.feedback?.message}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Submitted</label>
              <p className="mt-1 text-gray-500 text-sm">
                {formatDate(viewDialog.feedback?.created_at || '')}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeViewDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={closeDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Feedback</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete feedback from &quot;{deleteDialog.feedback?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteDialog.feedback && deleteFeedback(deleteDialog.feedback.id)}
            >
              Delete Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackTable;
