import { HttpError } from "../../errors/http-error";
import { BookingRepository } from "../../repositories/booking.repository";

const bookingRepository = new BookingRepository();

export class AdminBookingService {
  async getAllBookings() {
    return await bookingRepository.getAllBookings();
  }

  async getBookingById(id: string) {
    const booking = await bookingRepository.getBookingByIdForAdmin(id);
    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }
    return booking;
  }

  async updateBooking(
    id: string,
    payload: Partial<{
      date: string;
      time: string;
      duration: string;
      paymentMethod: "esewa" | "khalti";
      amount: number;
      paymentStatus: "pending" | "paid" | "failed";
      bookingStatus: "pending" | "confirmed" | "cancelled" | "completed";
    }>
  ) {
    const existing = await bookingRepository.getBookingById(id);
    if (!existing) {
      throw new HttpError(404, "Booking not found");
    }

    const updated = await bookingRepository.updateBookingById(id, payload);
    if (!updated) {
      throw new HttpError(500, "Failed to update booking");
    }

    return updated;
  }

  async deleteBooking(id: string) {
    const existing = await bookingRepository.getBookingById(id);
    if (!existing) {
      throw new HttpError(404, "Booking not found");
    }

    const deleted = await bookingRepository.deleteBookingById(id);
    return !!deleted;
  }
}
