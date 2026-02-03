"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { API } from "@/lib/api/endpoints";

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
        