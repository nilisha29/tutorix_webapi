import axios from "./axios";
import { API } from "./endpoints";


export const createTutorReview = async (
  tutorId: string,
  payload: { quote: string; rating: number }
) => {
  const response = await axios.post(`${API.TUTORS.BASE}/${tutorId}/reviews`, payload);
  return response.data;
};
