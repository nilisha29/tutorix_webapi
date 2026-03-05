import { Request, Response } from "express";
import { AdminBookingService } from "../../services/admin/booking.service";

const adminBookingService = new AdminBookingService();

export class AdminBookingController {
  async getAllBookings(req: Request, res: Response) {
    try {
      const data = await adminBookingService.getAllBookings();
      return res.status(200).json({ success: true, message: "All bookings retrieved", data });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async getBookingById(req: Request, res: Response) {
    try {
      const data = await adminBookingService.getBookingById(req.params.id);
      return res.status(200).json({ success: true, message: "Booking retrieved", data });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async updateBooking(req: Request, res: Response) {
    try {
      const data = await adminBookingService.updateBooking(req.params.id, {
        date: req.body.date,
        time: req.body.time,
        duration: req.body.duration,
        paymentMethod: req.body.paymentMethod,
        amount: req.body.amount !== undefined ? Number(req.body.amount) : undefined,
        paymentStatus: req.body.paymentStatus,
        bookingStatus: req.body.bookingStatus,
      });
      return res.status(200).json({ success: true, message: "Booking updated", data });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async deleteBooking(req: Request, res: Response) {
    try {
      const deleted = await adminBookingService.deleteBooking(req.params.id);
      return res.status(200).json({ success: true, message: deleted ? "Booking deleted" : "Booking not deleted" });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }
}
