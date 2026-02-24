import axios from "./axios";
import { API } from "./endpoints";

export const createBooking = async (payload: {
  tutorId: string;
  date: string;
  time: string;
  duration: string;
  paymentMethod: "esewa" | "khalti";
  amount: number;
  paymentStatus?: "pending" | "paid" | "failed";
  bookingStatus?: "pending" | "confirmed" | "cancelled" | "completed";
}) => {
  const response = await axios.post(API.BOOKINGS.CREATE, payload);
  return response.data;
};

export const getMyStudentBookings = async () => {
  const response = await axios.get(API.BOOKINGS.MY_STUDENT);
  return response.data;
};

export const getMyTutorBookings = async () => {
  const response = await axios.get(API.BOOKINGS.MY_TUTOR);
  return response.data;
};

export const getAllBookingsForAdmin = async () => {
  const response = await axios.get(API.BOOKINGS.ADMIN_ALL);
  return response.data;
};
