import mongoose from "mongoose";
import crypto from "crypto";
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
    const esewaLink = process.env.ESEWA_CHECKOUT_LINK || process.env.NEXT_PUBLIC_ESEWA_CHECKOUT_LINK;
    const khaltiLink = process.env.KHALTI_CHECKOUT_LINK || process.env.NEXT_PUBLIC_KHALTI_CHECKOUT_LINK;

    if (payload.paymentMethod === "esewa" && !esewaLink) {
      throw new HttpError(400, "eSewa link is not configured. Set ESEWA_CHECKOUT_LINK in backend env.");
    }

    if (payload.paymentMethod === "khalti" && !khaltiLink) {
      throw new HttpError(400, "Khalti link is not configured. Set KHALTI_CHECKOUT_LINK in backend env.");
    }

    const paymentRef = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const booking = await this.createBooking(studentId, {
      ...payload,
      paymentStatus: "pending",
      bookingStatus: "pending",
    });

    booking.paymentRef = paymentRef;
    await booking.save();

    const frontendBaseUrl = process.env.FRONTEND_BASE_URL || "http://localhost:3000";
    const successUrl = `${frontendBaseUrl}/payment/result?bookingId=${booking._id}&ref=${encodeURIComponent(paymentRef)}&method=${payload.paymentMethod}&status=success`;
    const failureUrl = `${frontendBaseUrl}/payment/result?bookingId=${booking._id}&ref=${encodeURIComponent(paymentRef)}&method=${payload.paymentMethod}&status=failed`;

    let redirectUrl = "";
    let redirectMethod: "GET" | "POST" = "GET";
    let redirectFormFields: Record<string, string> | undefined;

    if (payload.paymentMethod === "esewa") {
      if (!esewaLink) {
        throw new HttpError(400, "eSewa link is not configured");
      }

      const productCode = process.env.ESEWA_PRODUCT_CODE;
      const secretKey = process.env.ESEWA_SECRET_KEY;

      if (!productCode || !secretKey) {
        throw new HttpError(400, "eSewa credentials missing. Set ESEWA_PRODUCT_CODE and ESEWA_SECRET_KEY in backend env.");
      }

      const totalAmount = Number(payload.amount).toFixed(2);
      const signedFieldNames = "total_amount,transaction_uuid,product_code";
      const signMessage = `total_amount=${totalAmount},transaction_uuid=${paymentRef},product_code=${productCode}`;
      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(signMessage)
        .digest("base64");

      redirectUrl = esewaLink;
      redirectMethod = "POST";
      redirectFormFields = {
        amount: totalAmount,
        tax_amount: "0",
        total_amount: totalAmount,
        transaction_uuid: paymentRef,
        product_code: productCode,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: successUrl,
        failure_url: failureUrl,
        signed_field_names: signedFieldNames,
        signature,
      };
    }

    if (payload.paymentMethod === "khalti") {
      if (!khaltiLink) {
        throw new HttpError(400, "Khalti link is not configured");
      }

      redirectUrl = `${khaltiLink}${khaltiLink.includes("?") ? "&" : "?"}amount=${encodeURIComponent(String(payload.amount))}&ref=${encodeURIComponent(paymentRef)}&return_url=${encodeURIComponent(successUrl)}`;
    }

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
    const booking = await bookingRepository.getBookingById(payload.bookingId);
    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    if (String(booking.studentId) !== String(studentId)) {
      throw new HttpError(403, "You are not allowed to verify this booking");
    }

    const normalizedStatus = (payload.status || "").toLowerCase();
    const isSuccess = ["success", "paid", "complete", "completed"].includes(normalizedStatus);

    const updatedBooking = await bookingRepository.updatePaymentStatus(payload.bookingId, {
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
