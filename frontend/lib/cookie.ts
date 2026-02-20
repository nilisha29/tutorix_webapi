"use server"
import { cookies } from "next/headers"

export const setAuthToken = async (token: string) => {
    const cookieStore = await cookies();
    cookieStore.set({ name: "auth_token", value: token })
}
export const getAuthToken = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    return token || null;
}
export const setUserData = async (userData: any) => {
    const cookieStore = await cookies();
    // cookie can only store string
    // convert object to string -> JSON.stringify "{}"
    const userDataStr = JSON.stringify(userData);
    cookieStore.set({ name: "user_data", value: userDataStr })
}
export const getUserData = async () => {
    const cookieStore = await cookies();
    const userData = cookieStore.get("user_data")?.value;
    if (userData) {
        // convert string to object -> JSON.parse
        const parsed = JSON.parse(userData);
        console.log("[getUserData] Role from cookie:", parsed?.role);
        return parsed;
    }
    return null;
}

export const clearAuthCookies = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("user_data");
}