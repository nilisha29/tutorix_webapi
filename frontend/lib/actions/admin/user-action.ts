"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { API } from "@/lib/api/endpoints";
import { setUserData } from "@/lib/cookie";


export const handleCreateUser = async (data: FormData) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

        const response = await fetch(`${baseUrl}${API.ADMIN.USER.CREATE}`, {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            body: data,
        });


        const result = await response.json();

        if (response.ok && result.success) {
            revalidatePath("/admin/users");
            return {
                success: true,
                message: "Registration successful",
                data: result.data,
            };
        }

        return {
            success: false,
            message: result.message || "Registration failed",
        };
    } catch (error: Error | any) {
        return { success: false, message: error.message || "Registration action failed" };
    }
};

export const handleUpdateUser = async (id: string, data: FormData) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

        const response = await fetch(`${baseUrl}${API.ADMIN.USER.UPDATE}${id}`, {
            method: "PUT",
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            body: data,
        });

        const result = await response.json();

        if (response.ok && result.success) {
            revalidatePath("/admin/users");
            revalidatePath(`/admin/users/${id}`);
            return {
                success: true,
                message: "User updated successfully",
                data: result.data,
            };
        }

        return {
            success: false,
            message: result.message || "Update failed",
        };
    } catch (error: Error | any) {
        return { success: false, message: error.message || "Update action failed" };
    }
};

export const handleBecomeTutor = async (data: FormData) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

        if (!token) {
            return {
                success: false,
                message: "Authentication required. Please login first.",
            };
        }

        const response = await fetch(`${baseUrl}/api/auth/become-tutor`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: data,
        });

        const contentType = response.headers.get("content-type");
        let result;

        if (contentType && contentType.includes("application/json")) {
            result = await response.json();
        } else {
            const text = await response.text();
            result = { message: text || "Unknown error" };
        }

        if (response.ok && result.success) {
            // Update user data in cookie with the new tutor role
            if (result.data) {
                console.log("[handleBecomeTutor] Response data:", result.data);
                console.log("[handleBecomeTutor] Response role:", result.data.role);
                await setUserData(result.data);
            }
            revalidatePath("/tutor/dashboard");
            revalidatePath("/user/dashboard");
            return {
                success: true,
                message: "Welcome to the tutor community!",
                data: result.data,
            };
        }

        return {
            success: false,
            message: result.message || "Failed to become a tutor",
        };
    } catch (error: Error | any) {
        console.error("Become tutor error:", error);
        return { 
            success: false, 
            message: error.message || "Network error - please check if backend is running" 
        };
    }
};