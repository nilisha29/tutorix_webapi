import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import { InitiatePaymentDTO, VerifyPaymentDTO } from "../dtos/payment.dto";

const paymentService = new PaymentService();

export class PaymentController {
  async initiatePayment(req: Request, res: Response) {
    try {
      const studentId = req.user?._id;
      if (!studentId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const parsedData = InitiatePaymentDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          errors: parsedData.error.flatten(),
        });
      }

      const result = await paymentService.initiatePayment(String(studentId), parsedData.data);

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

      const parsedData = VerifyPaymentDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          errors: parsedData.error.flatten(),
        });
      }

      const booking = await paymentService.verifyPayment(String(studentId), parsedData.data);

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
