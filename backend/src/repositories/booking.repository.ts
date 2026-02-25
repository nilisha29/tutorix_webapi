import { BookingModel, IBooking } from "../models/booking.model";

export class BookingRepository {
  async createBooking(data: Partial<IBooking>) {
    const booking = new BookingModel(data);
    return await booking.save();
  }

  async getBookingById(bookingId: string) {
    return await BookingModel.findById(bookingId).exec();
  }

  async updatePaymentStatus(
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

  async getBookingsByStudent(studentId: string) {
    return await BookingModel.find({ studentId })
      .populate("tutorId", "fullName username email profileImage")
      .sort({ createdAt: -1 })
      .exec();
  }

  async getBookingsByTutor(tutorId: string) {
    return await BookingModel.find({ tutorId })
      .populate("studentId", "fullName username email profileImage")
      .sort({ createdAt: -1 })
      .exec();
  }

  async getAllBookings() {
    return await BookingModel.find()
      .populate("studentId", "fullName username email profileImage")
      .populate("tutorId", "fullName username email profileImage")
      .sort({ createdAt: -1 })
      .exec();
  }
}
