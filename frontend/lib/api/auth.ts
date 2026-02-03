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
      API.AUTH.UPDATEPROFILE,
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