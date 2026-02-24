import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";

const bookingService = new BookingService();

export class BookingController {
  async createBooking(req: Request, res: Response) {
    try {
      const studentId = req.user?._id;
      if (!studentId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const booking = await bookingService.createBooking(String(studentId), {
        tutorId: req.body.tutorId,
        date: req.body.date,
        time: req.body.time,
        duration: req.body.duration,
        paymentMethod: req.body.paymentMethod,
        amount: Number(req.body.amount),
        paymentStatus: req.body.paymentStatus,
        bookingStatus: req.body.bookingStatus,
      });

      return res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: booking,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getMyStudentBookings(req: Request, res: Response) {
    try {
      const studentId = req.user?._id;
      if (!studentId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const bookings = await bookingService.getStudentBookings(String(studentId));
      return res.status(200).json({
        success: true,
        message: "Student bookings retrieved",
        data: bookings,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getMyTutorBookings(req: Request, res: Response) {
    try {
      const tutorId = req.user?._id;
      if (!tutorId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const bookings = await bookingService.getTutorBookings(String(tutorId));
      return res.status(200).json({
        success: true,
        message: "Tutor bookings retrieved",
        data: bookings,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getAllBookings(req: Request, res: Response) {
    try {
      const bookings = await bookingService.getAllBookings();
      return res.status(200).json({
        success: true,
        message: "All bookings retrieved",
        data: bookings,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
