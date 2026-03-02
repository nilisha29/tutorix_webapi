import mongoose from "mongoose";
import { HttpError } from "../errors/http-error";
import { BookingRepository } from "../repositories/booking.repository";
import { UserRepository } from "../repositories/user.repository";
import { PaymentRepository } from "../repositories/payment.repository";

const bookingRepository = new BookingRepository();
const userRepository = new UserRepository();
const paymentRepository = new PaymentRepository();

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

  async initiatePayment(
    studentId: string,
    payload: {
      tutorId: string;
      date: string;
      time: string;
      duration: string;
      paymentMethod: "esewa" | "khalti";
      amount: number;
    }
  ) {
    const paymentRef = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const booking = await this.createBooking(studentId, {
      ...payload,
      paymentStatus: "pending",
      bookingStatus: "pending",
    });

    await paymentRepository.setPaymentReference(String(booking._id), paymentRef);

    const frontendBaseUrl = process.env.FRONTEND_BASE_URL || "http://localhost:3000";
    const successUrl = `${frontendBaseUrl}/payment/result?bookingId=${booking._id}&ref=${encodeURIComponent(paymentRef)}&method=${payload.paymentMethod}&status=success`;
    const failureUrl = `${frontendBaseUrl}/payment/result?bookingId=${booking._id}&ref=${encodeURIComponent(paymentRef)}&method=${payload.paymentMethod}&status=failed`;

    const redirectUrl = `${frontendBaseUrl}/payment/checkout?bookingId=${booking._id}&ref=${encodeURIComponent(paymentRef)}&method=${payload.paymentMethod}&amount=${encodeURIComponent(String(payload.amount))}`;
    const redirectMethod: "GET" | "POST" = "GET";
    const redirectFormFields: Record<string, string> | undefined = undefined;

    return {
      booking,
      paymentRef,
      redirectUrl,
      redirectMethod,
      redirectFormFields,
      successUrl,
      failureUrl,
    };
  }

  async verifyPayment(
    studentId: string,
    payload: {
      bookingId: string;
      status: string;
      gatewayTxnId?: string;
    }
  ) {
    const booking = await paymentRepository.getBookingById(payload.bookingId);
    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    if (String(booking.studentId) !== String(studentId)) {
      throw new HttpError(403, "You are not allowed to verify this booking");
    }

    const normalizedStatus = (payload.status || "").toLowerCase();
    const isSuccess = ["success", "paid", "complete", "completed"].includes(normalizedStatus);

    const updatedBooking = await paymentRepository.updatePaymentVerification(payload.bookingId, {
      paymentStatus: isSuccess ? "paid" : "failed",
      bookingStatus: isSuccess ? "confirmed" : "pending",
      gatewayTxnId: payload.gatewayTxnId,
    });

    if (!updatedBooking) {
      throw new HttpError(500, "Failed to update booking payment status");
    }

    return updatedBooking;
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
