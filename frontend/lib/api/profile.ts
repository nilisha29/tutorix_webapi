import axios from "./axios";
import { API } from "./endpoints";

export const getMyProfile = async () => {
  const response = await axios.get(API.AUTH.PROFILE.WHOAMI);
  return response.data;
};

export const updateMyProfile = async (profileData: any) => {
  const response = await axios.put(API.AUTH.PROFILE.UPDATE, profileData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const becomeTutor = async (payload: FormData | Record<string, any>) => {
  const response = await axios.put(API.AUTH.TUTOR.BECOME, payload, {
    headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
};
