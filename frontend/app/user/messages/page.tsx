"use client";

import { useEffect, useMemo, useState } from "react";
import { deleteConversation, deleteMessage, getStudentInboxMessages, sendTutorMessage } from "@/lib/api/message";

const getProfileImageUrl = (profileImage?: string) => {
  if (!profileImage) return "";
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
  if (profileImage.startsWith("http")) return profileImage.replace("10.0.2.2", "localhost");
  return `${baseUrl}${profileImage.startsWith("/") ? "" : "/"}${profileImage}`.replace("10.0.2.2", "localhost");
};

const getInitial = (name?: string) => {
  return String(name || "U").trim().charAt(0).toUpperCase() || "U";
};

export default function UserMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTutorId, setSelectedTutorId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingConversation, setDeletingConversation] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getStudentInboxMessages();
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
      const tutor = item.tutorId;
      const tutorId = String(tutor?._id || "");
      if (!tutorId) return;

      const existing = grouped.get(tutorId);
      if (!existing) {
        grouped.set(tutorId, {
          tutorId,
          tutorName: tutor?.fullName || tutor?.username || "Tutor",
          tutorImage: tutor?.profileImage || "",
          lastMessage: item.content,
          lastMessageAt: item.createdAt,
        });
        return;
      }

      if (new Date(item.createdAt).getTime() > new Date(existing.lastMessageAt).getTime()) {
        grouped.set(tutorId, {
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
    if (!selectedTutorId && conversations.length > 0) {
      setSelectedTutorId(conversations[0].tutorId);
    }
  }, [selectedTutorId, conversations]);

  const activeMessages = useMemo(() => {
    if (!selectedTutorId) return [];

    return messages
      .filter((item) => String(item.tutorId?._id || "") === selectedTutorId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [messages, selectedTutorId]);

  const activeTutor = conversations.find((item) => item.tutorId === selectedTutorId);

  const filteredConversations = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return conversations;

    return conversations.filter((chat) => {
      const name = String(chat.tutorName || "").toLowerCase();
      const preview = String(chat.lastMessage || "").toLowerCase();
      return name.includes(keyword) || preview.includes(keyword);
    });
  }, [conversations, searchTerm]);

  const handleSend = async () => {
    const content = messageText.trim();
    if (!selectedTutorId || !content) return;

    try {
      setSending(true);
      const result = await sendTutorMessage({ tutorId: selectedTutorId, content });
      if (result?.data) {
        setMessages((prev) => [...prev, result.data]);
      }
      setMessageText("");
    } catch (err: Error | any) {
      setError(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="py-6 pb-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Messages</h1>

      <div className="grid h-[calc(100vh-220px)] min-h-[520px] gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[320px_1fr]">
        <div className="min-h-0 rounded-xl border border-slate-200 bg-white flex flex-col">
          <div className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">Chats</div>
          <div className="px-4 py-3 border-b border-slate-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search chats..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {loading && <p className="px-4 py-3 text-sm text-gray-500">Loading chats...</p>}
            {!loading && filteredConversations.length === 0 && (
              <p className="px-4 py-6 text-sm text-gray-500">No chats yet</p>
            )}

            {filteredConversations.map((chat) => (
              <button
                key={chat.tutorId}
                onClick={() => setSelectedTutorId(chat.tutorId)}
                className={`w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${
                  selectedTutorId === chat.tutorId ? "bg-slate-100" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {chat.tutorImage ? (
                    <img
                      src={getProfileImageUrl(chat.tutorImage)}
                      alt={chat.tutorName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-slate-200 text-slate-700 text-sm font-semibold flex items-center justify-center">
                      {getInitial(chat.tutorName)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{chat.tutorName}</p>
                    <p className="truncate text-xs text-gray-500">{chat.lastMessage}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex h-full min-h-0 flex-col rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-3">
              {activeTutor?.tutorImage ? (
                <img
                  src={getProfileImageUrl(activeTutor.tutorImage)}
                  alt={activeTutor?.tutorName || "Tutor"}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-slate-200 text-slate-700 text-sm font-semibold flex items-center justify-center">
                  {getInitial(activeTutor?.tutorName)}
                </div>
              )}
              <p className="text-sm font-semibold text-slate-800">{activeTutor?.tutorName || "Select a chat"}</p>
            </div>
            <button
              onClick={async () => {
                if (!selectedTutorId) return;
                if (!confirm("Delete entire chat?")) return;

                try {
                  setDeletingConversation(true);
                  await deleteConversation(selectedTutorId);
                  setMessages((prev) =>
                    prev.filter((item) => String(item.tutorId?._id || "") !== selectedTutorId)
                  );
                  setSelectedTutorId("");
                } catch (err: Error | any) {
                  setError(err.message || "Failed to delete chat");
                } finally {
                  setDeletingConversation(false);
                }
              }}
              disabled={!selectedTutorId || deletingConversation}
              className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
            >
              {deletingConversation ? "Deleting Chat..." : "Delete Chat"}
            </button>
          </div>
          <div className="px-4 pb-2">
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          <div className="flex-1 min-h-0 space-y-3 overflow-y-auto overflow-x-hidden bg-slate-50 p-4">
            {activeMessages.length === 0 && (
              <p className="text-sm text-gray-500">No messages in this chat.</p>
            )}

            {activeMessages.map((item) => {
              const mine = item.senderRole === "student";
              const partnerName = item.tutorId?.fullName || item.tutorId?.username || "Tutor";
              const partnerImage = item.tutorId?.profileImage || "";

              return (
                <div key={item._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : ""}`}>
                    {!mine && (
                      partnerImage ? (
                        <img
                          src={getProfileImageUrl(partnerImage)}
                          alt={partnerName}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-slate-200 text-slate-700 text-[10px] font-semibold flex items-center justify-center">
                          {getInitial(partnerName)}
                        </div>
                      )
                    )}
                    <div className={`relative max-w-[78%] rounded-2xl px-3 py-2 text-sm shadow-xs ${mine ? "bg-blue-600 text-white" : "bg-white text-gray-800 border border-gray-200"}`}>
                      <p className="break-words whitespace-pre-wrap">{item.content}</p>
                      <div className={`mt-1 flex items-center justify-between gap-3 text-[10px] ${mine ? "text-blue-100" : "text-gray-400"}`}>
                        <span>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</span>
                        <button
                          onClick={() => setOpenMenuId((prev) => (prev === item._id ? null : item._id))}
                          className={`${mine ? "text-blue-100" : "text-slate-400"} px-1`}
                          aria-label="Open message actions"
                        >
                          ⋮
                        </button>
                        {openMenuId === item._id && (
                          <div className="absolute right-2 bottom-8 z-10 rounded-md border border-slate-200 bg-white shadow-sm">
                            <button
                              onClick={async () => {
                                try {
                                  setDeletingId(item._id);
                                  await deleteMessage(String(item._id));
                                  setMessages((prev) => prev.filter((message) => message._id !== item._id));
                                  setOpenMenuId(null);
                                } catch (err: Error | any) {
                                  setError(err.message || "Failed to delete message");
                                } finally {
                                  setDeletingId(null);
                                }
                              }}
                              disabled={deletingId === item._id}
                              className="block w-full px-3 py-1.5 text-left text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
                            >
                              {deletingId === item._id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-200 p-3">
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
                placeholder={selectedTutorId ? "Type your message..." : "Select a chat to start messaging"}
                disabled={!selectedTutorId || sending}
                className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400 disabled:bg-gray-100"
              />
              <button
                onClick={handleSend}
                disabled={!selectedTutorId || sending || !messageText.trim()}
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
