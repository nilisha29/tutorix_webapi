// backend api call only
import axios from "./axios"; // IMPORTANT: import axios instance
import { API } from "./endpoints";

import { LoginData, RegisterData } from "@/app/(auth)/schema"

// registerData: any -> can be schema object 
export const registerUser = async (registerData: any) => {
    try {
        const response = await axios.post(
            API.AUTH.REGISTER, // backend route path
            registerData // data to send to backend (req.body)
        );
        return response.data; // response ko body, 
        // what is returned from backend - controller
    } catch (err: Error | any) {
        // if 4xx or 5xx counts as error
        throw new Error
            (
                err.response?.data?.message  // from backend
                || err.message // general error message
                || "Registration failed" // fallback message
            );
    }
}
export const loginUser = async (loginData: any) => {
    try {
        const response = await axios.post(
            API.AUTH.LOGIN, // change
            loginData // change
        );
        return response.data; // response ko body, 
        // what is returned from backend - controller
    } catch (err: Error | any) {
        // if 4xx or 5xx counts as error
        throw new Error
            (
                err.response?.data?.message  // from backend
                || err.message // general error message
                || "Login failed" // change
            );
    }
}

export const forgotPassword = async (email: string) => {
  try {
    const originHeader =
      typeof window !== "undefined" ? window.location.origin : undefined;

    const response = await axios.post(
      API.AUTH.FORGOT_PASSWORD,
      { email },
      originHeader
        ? {
            headers: {
              "x-client-origin": originHeader,
            },
          }
        : undefined
    );
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message ||
      err.message ||
      "Forgot password request failed"
    );
  }
};

export const resetPassword = async (payload: { token: string; password: string }) => {
  try {
    const response = await axios.post(API.AUTH.RESET_PASSWORD, payload);
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message ||
      err.message ||
      "Reset password failed"
    );
  }
};

export const changePassword = async (payload: { currentPassword: string; newPassword: string }) => {
  try {
    const response = await axios.put(API.AUTH.CHANGE_PASSWORD, payload);
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message ||
      err.message ||
      "Change password failed"
    );
  }
};

export const whoAmI = async () => {
  try {
    const response = await axios.get(API.AUTH.WHOAMI);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message
      || error.message || 'Whoami failed');
  }
}

export const updateProfile = async (profileData: any) => {
  try {
    const response = await axios.put(
      API.AUTH.UPDATE_PROFILE,
      profileData,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // for file upload/multer
        }
      }
    );
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message
      || error.message || 'Update profile failed');
  }
}

export const getTutors = async () => {
  try {
    const response = await axios.get(API.AUTH.TUTOR.LIST);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message
      || error.message || 'Fetch tutors failed');
  }
}

export const getTutorById = async (tutorId: string) => {
  try {
    const response = await axios.get(`${API.TUTORS.BASE}/${tutorId}`);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message
      || error.message || 'Fetch tutor failed');
  }
}