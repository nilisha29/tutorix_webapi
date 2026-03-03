import axios from "./axios";
import { API } from "./endpoints";

export const getTutorList = async () => {
  const response = await axios.get(API.AUTH.TUTOR.LIST);
  return response.data;
};


export const getTutorDetail = async (tutorId: string) => {
  const response = await axios.get(`${API.TUTORS.BASE}/${tutorId}`);
  return response.data;
};
