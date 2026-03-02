import { BookingModel } from "../models/booking.model";

export class PaymentRepository {
  async setPaymentReference(bookingId: string, paymentRef: string) {
    return await BookingModel.findByIdAndUpdate(
      bookingId,
      { $set: { paymentRef } },
      { new: true }
    ).exec();
  }

  async getBookingById(bookingId: string) {
    return await BookingModel.findById(bookingId).exec();
  }

  async updatePaymentVerification(
    bookingId: string,
    payload: {
      paymentStatus: "pending" | "paid" | "failed";
      bookingStatus: "pending" | "confirmed" | "cancelled" | "completed";
      gatewayTxnId?: string;
    }
  ) {
    return await BookingModel.findByIdAndUpdate(
      bookingId,
      {
        $set: {
          paymentStatus: payload.paymentStatus,
          bookingStatus: payload.bookingStatus,
          gatewayTxnId: payload.gatewayTxnId,
        },
      },
      { new: true }
    ).exec();
  }
}
