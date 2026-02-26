import axios from "./axios";
import { API } from "./endpoints";

export const saveTutor = async (tutorId: string) => {
  const response = await axios.post(API.SAVED_TUTORS.SAVE, { tutorId });
  return response.data;
};

export const getMySavedTutors = async () => {
  const response = await axios.get(API.SAVED_TUTORS.MY_LIST);
  return response.data;
};

export const removeSavedTutor = async (tutorId: string) => {
  const response = await axios.delete(`${API.SAVED_TUTORS.REMOVE}/${tutorId}`);
  return response.data;
};
