import { API } from "../endpoints";
import axios from "../axios";


export const createUser = async (userData: any) => {
    try {
        const response = await axios.post(
            API.ADMIN.USER.BASE,
            userData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data', // for file upload/multer
                }
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Create user failed');
    }
}

export const getAllUsers = async () => {
    try {
        const response = await axios.get(API.ADMIN.USER.BASE);
        return response.data.data; // Extract the data array from the response
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Failed to fetch users');
    }
}

export const getUserById = async (id: string) => {
    try {
        const response = await axios.get(`${API.ADMIN.USER.BASE}/${id}`);
        return response.data.data; // Extract the data object from the response
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Failed to fetch user');
    }
}

export const updateUser = async (id: string, userData: any) => {
    try {
        const response = await axios.put(
            `${API.ADMIN.USER.BASE}/${id}`,
            userData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data.data; // Extract the data object from the response
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Failed to update user');
    }
}

export const deleteUser = async (id: string) => {
    try {
        const response = await axios.delete(`${API.ADMIN.USER.BASE}/${id}`);
        return response.data.data; // Extract the data from the response
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Failed to delete user');
    }
}

export const updateTutorReview = async (
    tutorId: string,
    reviewerId: string,
    reviewData: { quote?: string; rating?: number }
) => {
    try {
        const response = await axios.put(
            `${API.ADMIN.USER.BASE}/${tutorId}/reviews/${reviewerId}`,
            reviewData
        );
        return response.data.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Failed to update review');
    }
}

export const deleteTutorReview = async (tutorId: string, reviewerId: string) => {
    try {
        const response = await axios.delete(`${API.ADMIN.USER.BASE}/${tutorId}/reviews/${reviewerId}`);
        return response.data.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Failed to delete review');
    }
}