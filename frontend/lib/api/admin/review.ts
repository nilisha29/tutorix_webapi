import axios from "../axios";
import { API } from "../endpoints";


export const updateAdminTutorReview = async (
  tutorId: string,
  reviewerId: string,
  payload: { quote?: string; rating?: number }
) => {
  const response = await axios.put(
    `${API.ADMIN.USER.BASE}/${tutorId}/reviews/${reviewerId}`,
    payload
  );
  return response.data;
};

export const deleteAdminTutorReview = async (tutorId: string, reviewerId: string) => {
  const response = await axios.delete(
    `${API.ADMIN.USER.BASE}/${tutorId}/reviews/${reviewerId}`
  );
  return response.data;
};
