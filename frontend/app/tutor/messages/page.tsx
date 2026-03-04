"use client";

import { useEffect, useMemo, useState } from "react";
import { deleteConversation, deleteMessage, getTutorInboxMessages, replyToStudentMessage } from "@/lib/api/message";

export default function TutorMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingConversation, setDeletingConversation] = useState(false);

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

  const conversations = useMemo(() => {
    const grouped = new Map<string, any>();

    messages.forEach((item) => {
      const student = item.studentId;
      const studentId = String(student?._id || "");
      if (!studentId) return;

      const existing = grouped.get(studentId);
      if (!existing) {
        grouped.set(studentId, {
          studentId,
          studentName: student?.fullName || student?.username || "Student",
          lastMessage: item.content,
          lastMessageAt: item.createdAt,
        });
        return;
      }

      if (new Date(item.createdAt).getTime() > new Date(existing.lastMessageAt).getTime()) {
        grouped.set(studentId, {
          ...existing,
          lastMessage: item.content,
          lastMessageAt: item.createdAt,
        });
      }
    });

    return Array.from(grouped.values()).sort(
      (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );
  }, [messages]);

  useEffect(() => {
    if (!selectedStudentId && conversations.length > 0) {
      setSelectedStudentId(conversations[0].studentId);
    }
  }, [selectedStudentId, conversations]);

  const activeMessages = useMemo(() => {
    if (!selectedStudentId) return [];

    return messages
      .filter((item) => String(item.studentId?._id || "") === selectedStudentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [messages, selectedStudentId]);

  const activeStudent = conversations.find((item) => item.studentId === selectedStudentId);

  const filteredConversations = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return conversations;

    return conversations.filter((chat) => {
      const name = String(chat.studentName || "").toLowerCase();
      const preview = String(chat.lastMessage || "").toLowerCase();
      return name.includes(keyword) || preview.includes(keyword);
    });
  }, [conversations, searchTerm]);

  const handleSend = async () => {
    const content = messageText.trim();
    if (!selectedStudentId || !content) return;

    try {
      setSending(true);
      const result = await replyToStudentMessage({ studentId: selectedStudentId, content });
      if (result?.data) {
        setMessages((prev) => [...prev, result.data]);
      }
      setMessageText("");
    } catch (err: Error | any) {
      setError(err.message || "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pb-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Messages</h1>

      <div className="grid h-[calc(100vh-220px)] min-h-[520px] gap-4 overflow-hidden rounded-2xl border border-blue-100 bg-linear-to-br from-white to-blue-50 p-4 shadow-sm md:grid-cols-[320px_1fr]">
        <div className="min-h-0 rounded-xl border border-blue-100 bg-white flex flex-col">
          <div className="border-b border-blue-100 px-4 py-3 text-sm font-semibold text-slate-700">Chats</div>
          <div className="px-4 py-3 border-b border-blue-100">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search chats..."
              className="w-full rounded-lg border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {loading && <p className="px-4 py-3 text-sm text-gray-500">Loading chats...</p>}
            {!loading && filteredConversations.length === 0 && (
              <p className="px-4 py-6 text-sm text-gray-500">No chats yet</p>
            )}

            {filteredConversations.map((chat) => (
              <button
                key={chat.studentId}
                onClick={() => setSelectedStudentId(chat.studentId)}
                className={`w-full border-b border-blue-50 px-4 py-3 text-left transition hover:bg-blue-50 ${
                  selectedStudentId === chat.studentId ? "bg-blue-100/60" : ""
                }`}
              >
                <p className="text-sm font-semibold text-gray-800">{chat.studentName}</p>
                <p className="truncate text-xs text-gray-500">{chat.lastMessage}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex h-full min-h-0 flex-col rounded-xl border border-blue-100 bg-white">
          <div className="flex items-center justify-between border-b border-blue-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-800">{activeStudent?.studentName || "Select a chat"}</p>
            <button
              onClick={async () => {
                if (!selectedStudentId) return;
                if (!confirm("Delete entire chat?")) return;

                try {
                  setDeletingConversation(true);
                  await deleteConversation(selectedStudentId);
                  setMessages((prev) =>
                    prev.filter((item) => String(item.studentId?._id || "") !== selectedStudentId)
                  );
                  setSelectedStudentId("");
                } catch (err: Error | any) {
                  setError(err.message || "Failed to delete chat");
                } finally {
                  setDeletingConversation(false);
                }
              }}
              disabled={!selectedStudentId || deletingConversation}
              className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
            >
              {deletingConversation ? "Deleting Chat..." : "Delete Chat"}
            </button>
          </div>
          <div className="px-4 pb-2">
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          <div className="flex-1 min-h-0 space-y-3 overflow-y-auto bg-linear-to-b from-slate-50 to-blue-50 p-4">
            {activeMessages.length === 0 && (
              <p className="text-sm text-gray-500">No messages in this chat.</p>
            )}

            {activeMessages.map((item) => {
              const mine = item.senderRole === "tutor";

              return (
                <div key={item._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-xs ${mine ? "bg-blue-600 text-white" : "bg-white text-gray-800 border border-gray-200"}`}>
                    <p>{item.content}</p>
                    <div className={`mt-1 flex items-center justify-between gap-3 text-[10px] ${mine ? "text-blue-100" : "text-gray-400"}`}>
                      <span>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</span>
                      <button
                        onClick={async () => {
                          if (!confirm("Delete this message?")) return;
                          try {
                            setDeletingId(item._id);
                            await deleteMessage(String(item._id));
                            setMessages((prev) => prev.filter((message) => message._id !== item._id));
                          } catch (err: Error | any) {
                            setError(err.message || "Failed to delete message");
                          } finally {
                            setDeletingId(null);
                          }
                        }}
                        disabled={deletingId === item._id}
                        className={`${mine ? "text-blue-100" : "text-red-500"} underline disabled:opacity-50`}
                      >
                        {deletingId === item._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-blue-100 p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={selectedStudentId ? "Type your message..." : "Select a chat to start messaging"}
                disabled={!selectedStudentId || sending}
                className="w-full rounded-lg border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-400 disabled:bg-gray-100"
              />
              <button
                onClick={handleSend}
                disabled={!selectedStudentId || sending || !messageText.trim()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
