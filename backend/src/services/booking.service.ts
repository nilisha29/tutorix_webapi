import mongoose from "mongoose";
import { HttpError } from "../errors/http-error";
import { BookingRepository } from "../repositories/booking.repository";
import { UserRepository } from "../repositories/user.repository";

const bookingRepository = new BookingRepository();
const userRepository = new UserRepository();

export class BookingService {
  async createBooking(
    studentId: string,
    payload: {
      tutorId: string;
      date: string;
      time: string;
      duration: string;
      paymentMethod: "esewa" | "khalti";
      amount: number;
      paymentStatus?: "pending" | "paid" | "failed";
      bookingStatus?: "pending" | "confirmed" | "cancelled" | "completed";
    }
  ) {
    const tutor = await userRepository.getTutorById(payload.tutorId, false);
    if (!tutor) {
      throw new HttpError(404, "Tutor not found");
    }

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new HttpError(400, "Invalid student id");
    }

    if (String(tutor._id) === String(studentId)) {
      throw new HttpError(400, "You cannot book your own session");
    }

    return await bookingRepository.createBooking({
      studentId: new mongoose.Types.ObjectId(studentId),
      tutorId: new mongoose.Types.ObjectId(payload.tutorId),
      date: payload.date,
      time: payload.time,
      duration: payload.duration,
      paymentMethod: payload.paymentMethod,
      amount: payload.amount,
      paymentStatus: payload.paymentStatus || "pending",
      bookingStatus: payload.bookingStatus || "pending",
    } as any);
  }

  
  async getStudentBookings(studentId: string) {
    return await bookingRepository.getBookingsByStudent(studentId);
  }

  async getTutorBookings(tutorId: string) {
    return await bookingRepository.getBookingsByTutor(tutorId);
  }

  async getAllBookings() {
    return await bookingRepository.getAllBookings();
  }
}
