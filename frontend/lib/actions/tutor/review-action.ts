"use server";

import { cookies } from "next/headers";
import { API } from "@/lib/api/endpoints";

export const handleSubmitTutorReview = async (
  tutorId: string,
  payload: { quote: string; rating: number }
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

    if (!token) {
      return { success: false, message: "Please login first" };
    }

    const response = await fetch(`${baseUrl}${API.TUTORS.GET_BY_ID}/${tutorId}/reviews`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return {
        success: true,
        message: result.message || "Review submitted",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to submit review",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Review submission failed",
    };
  }
};
