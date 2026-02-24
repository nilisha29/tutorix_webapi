import { BookingModel, IBooking } from "../models/booking.model";

export class BookingRepository {
  async createBooking(data: Partial<IBooking>) {
    const booking = new BookingModel(data);
    return await booking.save();
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
