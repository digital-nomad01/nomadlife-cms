import FeedbackTable from "@/components/feedback-table";

export default function FeedbackPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Feedback</h1>
        <p className="text-gray-600">Reviews and feedback from our clients</p>
      </div>

      <FeedbackTable />
    </div>
  );
}
