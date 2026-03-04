import axios from "./axios";
import { API } from "./endpoints";

export const sendTutorMessage = async (payload: { tutorId: string; content: string }) => {
  const response = await axios.post(API.MESSAGES.BASE, payload);
  return response.data;
};

export const getTutorInboxMessages = async () => {
  const response = await axios.get(API.MESSAGES.TUTOR_INBOX);
  return response.data;
};

export const getStudentInboxMessages = async () => {
  const response = await axios.get(API.MESSAGES.STUDENT_INBOX);
  return response.data;
};

export const replyToStudentMessage = async (payload: { studentId: string; content: string }) => {
  const response = await axios.post(API.MESSAGES.REPLY, payload);
  return response.data;
};

export const deleteMessage = async (messageId: string) => {
  const response = await axios.delete(API.MESSAGES.DELETE(messageId));
  return response.data;
};

export const deleteConversation = async (partnerId: string) => {
  const response = await axios.delete(API.MESSAGES.DELETE_CONVERSATION(partnerId));
  return response.data;
};
