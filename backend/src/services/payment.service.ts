import { BookingService } from "./booking.service";

const bookingService = new BookingService();

export class PaymentService {
  async initiatePayment(
    studentId: string,
    payload: {
      tutorId: string;
      date: string;
      time: string;
      duration: string;
      paymentMethod: "esewa" | "khalti";
      amount: number;
    }
  ) {
    return await bookingService.initiatePayment(studentId, payload);
  }

  async verifyPayment(
    studentId: string,
    payload: {
      bookingId: string;
      status: string;
      gatewayTxnId?: string;
    }
  ) {
    return await bookingService.verifyPayment(studentId, payload);
  }
}
