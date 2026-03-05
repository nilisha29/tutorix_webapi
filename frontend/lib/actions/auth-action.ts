// server side processing
"use server";

// import { registerUser, loginUser } from "../api/auth";
// import { setUserData, setAuthToken } from "../cookie";

import { LoginData, RegisterData } from "@/app/(auth)/schema"
import { redirect } from "next/navigation";
import { registerUser, loginUser, whoAmI, updateProfile } from '@/lib/api/auth';
import { clearAuthCookies, getAuthToken, getUserData, setAuthToken, setUserData } from '@/lib/cookie';
import { revalidatePath } from 'next/cache';

export const handleRegister = async (formData: any) => {
    try{
        // handle data from component form
        const result = await registerUser(formData);
        // handle how to send data back to component
        if(result.success){
            return { 
                success: true, 
                message: "Registration successful",
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Registration failed"
        }
    }catch(err: Error | any){
        return {
            success: false, message: err.message || "Registration failed"
        }
    }
}


export const handleLogin = async (formData: any) => {
    try{
        // handle data from component form
        const result = await loginUser(formData); // change
        // handle how to send data back to component
        if(result.success){
            await setAuthToken(result.token) 
            await setUserData(result.data)
            
            return {
                success: true, 
                message: "Login successful", // change
                data: result.data,
                token: result.token
            };
        }
        return {
            success: false,
            message: result.message || "Login failed" // change
        }
    }catch(err: Error | any){
        return {
            success: false, message: err.message || "Login failed" // change
        }
    }

}

    export const handleLogout = async () => {
    await clearAuthCookies();
    return redirect('/login');
}


export async function handleWhoAmI() {
    try {
        const token = await getAuthToken();
        const cachedUser = await getUserData();

        if (token && cachedUser) {
            return {
                success: true,
                message: 'User data fetched successfully',
                data: cachedUser
            };
        }

        const result = await whoAmI();
        if (result.success) {
            return {
                success: true,
                message: 'User data fetched successfully',
                data: result.data
            };
        }
        return { success: false, message: result.message || 'Failed to fetch user data' };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
}


export async function handleUpdateProfile(profileData: FormData) {
    try {
        const token = await getAuthToken();
        if (!token) {
            return { success: false, message: "Unauthorized" };
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
        const response = await fetch(`${baseUrl}/api/auth/update-profile`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: profileData,
        });

        const result = await response.json();
        if (result.success) {
            await setUserData(result.data); // update cookie 
            revalidatePath('/user/profile'); // revalidate profile page/ refresh new data
            return {
                success: true,
                message: 'Profile updated successfully',
                data: result.data
            };
        }
        return { success: false, message: result.message || 'Failed to update profile' };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
}
