"use client";

import { useEffect, useState } from "react";
import { deleteTutorMessage, getTutorInboxMessages } from "@/lib/api/message";

export default function TutorMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getTutorInboxMessages();
        setMessages(result.data || []);
      } catch (err: Error | any) {
        setError(err.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-600 mb-8">Messages</h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        {loading && <p className="text-gray-500">Loading messages...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">💬 No messages yet</p>
          </div>
        )}

        {!loading && !error && messages.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">From</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Message</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Date</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {messages.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                      {item.studentId?.fullName || item.studentId?.username || "Student"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xl wrap-break-word">{item.content}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={async () => {
                          if (!confirm("Delete this message?")) return;
                          try {
                            setDeletingId(item._id);
                            await deleteTutorMessage(String(item._id));
                            setMessages((prev) => prev.filter((message) => message._id !== item._id));
                          } catch (err: Error | any) {
                            setError(err.message || "Failed to delete message");
                          } finally {
                            setDeletingId(null);
                          }
                        }}
                        disabled={deletingId === item._id}
                        className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:opacity-50"
                      >
                        {deletingId === item._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
