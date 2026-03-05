import { BookingRepository } from "../../repositories/booking.repository";
import { HttpError } from "../../errors/http-error";

const bookingRepository = new BookingRepository();

export class AdminPaymentService {
  async getAllPayments() {
    return await bookingRepository.getAllBookings();
  }

  async getPaymentById(id: string) {
    const booking = await bookingRepository.getBookingByIdForAdmin(id);
    if (!booking) {
      throw new HttpError(404, "Payment record not found");
    }
    return booking;
  }

  async updatePayment(
    id: string,
    payload: Partial<{
      paymentMethod: "esewa" | "khalti";
      amount: number;
      paymentStatus: "pending" | "paid" | "failed";
      bookingStatus: "pending" | "confirmed" | "cancelled" | "completed";
    }>
  ) {
    const existing = await bookingRepository.getBookingById(id);
    if (!existing) {
      throw new HttpError(404, "Payment record not found");
    }

    const updated = await bookingRepository.updateBookingById(id, payload);
    if (!updated) {
      throw new HttpError(500, "Failed to update payment");
    }

    return updated;
  }

  async deletePayment(id: string) {
    const existing = await bookingRepository.getBookingById(id);
    if (!existing) {
      throw new HttpError(404, "Payment record not found");
    }

    const deleted = await bookingRepository.deleteBookingById(id);
    return !!deleted;
  }
}
