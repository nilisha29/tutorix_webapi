import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";

const paymentService = new PaymentService();

export class PaymentController {
  async initiatePayment(req: Request, res: Response) {
    try {
      const studentId = req.user?._id;
      if (!studentId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const result = await paymentService.initiatePayment(String(studentId), {
        tutorId: req.body.tutorId,
        date: req.body.date,
        time: req.body.time,
        duration: req.body.duration,
        paymentMethod: req.body.paymentMethod,
        amount: Number(req.body.amount),
      });

      return res.status(200).json({
        success: true,
        message: "Payment initiation created",
        data: result,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async verifyPayment(req: Request, res: Response) {
    try {
      const studentId = req.user?._id;
      if (!studentId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const booking = await paymentService.verifyPayment(String(studentId), {
        bookingId: req.body.bookingId,
        status: req.body.status,
        gatewayTxnId: req.body.gatewayTxnId,
      });

      return res.status(200).json({
        success: true,
        message: "Payment verified",
        data: booking,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
