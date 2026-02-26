import axios from "./axios";
import { API } from "./endpoints";

export const sendTutorMessage = async (payload: { tutorId: string; content: string }) => {
  const response = await axios.post(API.MESSAGES.SEND, payload);
  return response.data;
};

export const getTutorInboxMessages = async () => {
  const response = await axios.get(API.MESSAGES.TUTOR_INBOX);
  return response.data;
};

export const deleteTutorMessage = async (messageId: string) => {
  const response = await axios.delete(`${API.MESSAGES.DELETE}/${messageId}`);
  return response.data;
};
