import { BookingModel, IBooking } from "../models/booking.model";

export class BookingRepository {
  async createBooking(data: Partial<IBooking>) {
    const booking = new BookingModel(data);
    return await booking.save();
  }

  async getBookingById(bookingId: string) {
    return await BookingModel.findById(bookingId).exec();
  }

  async getBookingByIdForAdmin(bookingId: string) {
    return await BookingModel.findById(bookingId)
      .populate("studentId", "fullName username email profileImage")
      .populate("tutorId", "fullName username email profileImage")
      .exec();
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

  async updateBookingById(
    bookingId: string,
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
    return await BookingModel.findByIdAndUpdate(
      bookingId,
      {
        $set: {
          ...(payload.date !== undefined ? { date: payload.date } : {}),
          ...(payload.time !== undefined ? { time: payload.time } : {}),
          ...(payload.duration !== undefined ? { duration: payload.duration } : {}),
          ...(payload.paymentMethod !== undefined ? { paymentMethod: payload.paymentMethod } : {}),
          ...(payload.amount !== undefined ? { amount: payload.amount } : {}),
          ...(payload.paymentStatus !== undefined ? { paymentStatus: payload.paymentStatus } : {}),
          ...(payload.bookingStatus !== undefined ? { bookingStatus: payload.bookingStatus } : {}),
        },
      },
      { new: true }
    )
      .populate("studentId", "fullName username email profileImage")
      .populate("tutorId", "fullName username email profileImage")
      .exec();
  }

  async deleteBookingById(bookingId: string) {
    return await BookingModel.findByIdAndDelete(bookingId).exec();
  }
}
