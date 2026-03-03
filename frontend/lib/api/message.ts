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

export const deleteTutorMessage = async (messageId: string) => {
  const response = await axios.delete(`${API.MESSAGES.BASE}/${messageId}`);
  return response.data;
};
