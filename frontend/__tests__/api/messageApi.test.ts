import {
  sendTutorMessage,
  getTutorInboxMessages,
  getStudentInboxMessages,
  replyToStudentMessage,
  deleteConversation,
} from "@/lib/api/message";
import { API } from "@/lib/api/endpoints";
import axios from "@/lib/api/axios";

jest.mock("@/lib/api/axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("message api helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sendTutorMessage posts payload", async () => {
    const payload = { tutorId: "t1", content: "hello" };
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    await sendTutorMessage(payload);

    expect(axios.post).toHaveBeenCalledWith(API.MESSAGES.BASE, payload);
  });

  it("gets tutor and student inbox messages", async () => {
    (axios.get as jest.Mock)
      .mockResolvedValueOnce({ data: { success: true, data: [] } })
      .mockResolvedValueOnce({ data: { success: true, data: [] } });

    await getTutorInboxMessages();
    await getStudentInboxMessages();

    expect(axios.get).toHaveBeenNthCalledWith(1, API.MESSAGES.TUTOR_INBOX);
    expect(axios.get).toHaveBeenNthCalledWith(2, API.MESSAGES.STUDENT_INBOX);
  });

  it("replies and deletes conversation", async () => {
    const replyPayload = { studentId: "s1", content: "reply" };
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: { success: true } });
    (axios.delete as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    await replyToStudentMessage(replyPayload);
    await deleteConversation("u2");

    expect(axios.post).toHaveBeenCalledWith(API.MESSAGES.REPLY, replyPayload);
    expect(axios.delete).toHaveBeenCalledWith(API.MESSAGES.DELETE_CONVERSATION("u2"));
  });
});
