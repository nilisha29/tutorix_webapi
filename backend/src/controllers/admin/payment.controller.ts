import { Request, Response } from "express";
import { AdminPaymentService } from "../../services/admin/payment.service";

const adminPaymentService = new AdminPaymentService();

export class AdminPaymentController {
  async getAllPayments(req: Request, res: Response) {
    try {
      const data = await adminPaymentService.getAllPayments();
      return res.status(200).json({ success: true, message: "All payments retrieved", data });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async getPaymentById(req: Request, res: Response) {
    try {
      const data = await adminPaymentService.getPaymentById(req.params.id);
      return res.status(200).json({ success: true, message: "Payment retrieved", data });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async updatePayment(req: Request, res: Response) {
    try {
      const data = await adminPaymentService.updatePayment(req.params.id, {
        paymentMethod: req.body.paymentMethod,
        amount: req.body.amount !== undefined ? Number(req.body.amount) : undefined,
        paymentStatus: req.body.paymentStatus,
        bookingStatus: req.body.bookingStatus,
      });
      return res.status(200).json({ success: true, message: "Payment updated", data });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async deletePayment(req: Request, res: Response) {
    try {
      const deleted = await adminPaymentService.deletePayment(req.params.id);
      return res.status(200).json({ success: true, message: deleted ? "Payment deleted" : "Payment not deleted" });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }
}
