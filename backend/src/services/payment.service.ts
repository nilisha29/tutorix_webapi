import { HttpError } from "../errors/http-error";
import { BookingService } from "./booking.service";
import { GatewayPaymentService } from "./gateway-payment.service";
import { PaymentRepository } from "../repositories/payment.repository";

const bookingService = new BookingService();
const gatewayPaymentService = new GatewayPaymentService();
const paymentRepository = new PaymentRepository();

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
    const paymentRef = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const booking = await bookingService.createBooking(studentId, {
      ...payload,
      paymentStatus: "pending",
      bookingStatus: "pending",
    });

    await paymentRepository.setPaymentReference(String(booking._id), paymentRef);

    let gatewayInitResult: {
      redirectUrl: string;
      redirectMethod: "GET" | "POST";
      redirectFormFields?: Record<string, string>;
      gatewayRef?: string;
      successUrl: string;
      failureUrl: string;
      rawInitiateResponse?: Record<string, any>;
    };

    if (payload.paymentMethod === "khalti") {
      gatewayInitResult = await gatewayPaymentService.initiateKhaltiPayment({
        bookingId: String(booking._id),
        paymentRef,
        amount: payload.amount,
        customerName: "Tutorix Student",
      });
    } else {
      gatewayInitResult = await gatewayPaymentService.initiateEsewaPayment({
        bookingId: String(booking._id),
        paymentRef,
        amount: payload.amount,
      });
    }

    await paymentRepository.createPaymentRecord({
      bookingId: String(booking._id),
      studentId,
      gateway: payload.paymentMethod,
      amount: payload.amount,
      paymentRef,
      gatewayRef: gatewayInitResult.gatewayRef,
      rawInitiateResponse: gatewayInitResult.rawInitiateResponse,
    });

    return {
      booking,
      paymentRef,
      redirectUrl: gatewayInitResult.redirectUrl,
      redirectMethod: gatewayInitResult.redirectMethod,
      redirectFormFields: gatewayInitResult.redirectFormFields,
      successUrl: gatewayInitResult.successUrl,
      failureUrl: gatewayInitResult.failureUrl,
    };
  }

  async verifyPayment(
    studentId: string,
    payload: {
      bookingId?: string;
      provider?: "esewa" | "khalti";
      paymentRef?: string;
      status?: string;
      pidx?: string;
      transactionUuid?: string;
      gatewayTxnId?: string;
    }
  ) {
    const normalizedPayloadStatus = String(payload.status || "").trim().toLowerCase();

    let booking = null as any;
    let payment = null as any;

    if (payload.bookingId) {
      booking = await paymentRepository.getBookingById(payload.bookingId);
      if (!booking) {
        throw new HttpError(404, "Booking not found");
      }

      if (String(booking.studentId) !== String(studentId)) {
        throw new HttpError(403, "You are not allowed to verify this booking");
      }

      payment = await paymentRepository.getPaymentByBookingIdAndStudent(payload.bookingId, studentId);
    } else {
      const paymentRef = payload.paymentRef || payload.transactionUuid;
      if (!paymentRef) {
        throw new HttpError(400, "Missing bookingId or paymentRef for verification");
      }

      payment = await paymentRepository.getPaymentByPaymentRefAndStudent(paymentRef, studentId);
      if (payment) {
        booking = await paymentRepository.getBookingById(String(payment.bookingId));
      }
    }

    if (!payment) {
      throw new HttpError(404, "Payment record not found");
    }

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    if (String(booking.studentId) !== String(studentId)) {
      throw new HttpError(403, "You are not allowed to verify this booking");
    }

    const resolvedBookingId = String(booking._id);

    if (["cancel", "cancelled", "canceled", "failed", "failure"].includes(normalizedPayloadStatus)) {
      const updatedPayment = await paymentRepository.updatePaymentRecord(String(payment._id), {
        status: "failed",
        gatewayTxnId: payload.gatewayTxnId,
        rawVerifyResponse: {
          source: "callback",
          status: normalizedPayloadStatus,
        },
      });

      const updatedBooking = await paymentRepository.updatePaymentVerification(resolvedBookingId, {
        paymentStatus: "failed",
        bookingStatus: ["cancel", "cancelled", "canceled"].includes(normalizedPayloadStatus)
          ? "cancelled"
          : "pending",
        gatewayTxnId: payload.gatewayTxnId,
      });

      return {
        booking: updatedBooking,
        payment: updatedPayment,
        verified: false,
      };
    }

    const provider = payload.provider || payment.gateway;

    let verificationResult: {
      isPaid: boolean;
      isPending?: boolean;
      gatewayTxnId: string;
      rawVerifyResponse?: Record<string, any>;
    };

    if (provider === "khalti") {
      const pidx = payload.pidx || payment.gatewayRef;
      if (!pidx) {
        throw new HttpError(400, "Missing Khalti payment identifier");
      }

      verificationResult = await gatewayPaymentService.verifyKhaltiPayment(pidx);
    } else {
      const transactionUuid = payload.transactionUuid || payment.gatewayRef || payment.paymentRef;
      verificationResult = await gatewayPaymentService.verifyEsewaPayment({
        transactionUuid,
        totalAmount: Number(payment.amount),
      });
    }

    const shouldKeepPendingForSuccessCallback =
      provider === "esewa" &&
      normalizedPayloadStatus === "success" &&
      !verificationResult.isPaid;

    const nextPaymentStatus = verificationResult.isPaid
      ? "paid"
      : verificationResult.isPending || shouldKeepPendingForSuccessCallback
      ? "pending"
      : "failed";
    const nextBookingStatus = verificationResult.isPaid ? "confirmed" : "pending";

    const updatedPayment = await paymentRepository.updatePaymentRecord(String(payment._id), {
      status: nextPaymentStatus,
      gatewayTxnId: verificationResult.gatewayTxnId,
      rawVerifyResponse: verificationResult.rawVerifyResponse,
    });

    const updatedBooking = await paymentRepository.updatePaymentVerification(resolvedBookingId, {
      paymentStatus: nextPaymentStatus,
      bookingStatus: nextBookingStatus,
      gatewayTxnId: verificationResult.gatewayTxnId,
    });

    return {
      booking: updatedBooking,
      payment: updatedPayment,
      verified: verificationResult.isPaid,
    };
  }
}
