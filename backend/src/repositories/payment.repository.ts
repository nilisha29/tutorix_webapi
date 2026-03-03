import { BookingModel } from "../models/booking.model";
import mongoose from "mongoose";
import { PaymentModel } from "../models/payment.model";

export class PaymentRepository {
  async setPaymentReference(bookingId: string, paymentRef: string) {
    return await BookingModel.findByIdAndUpdate(
      bookingId,
      { $set: { paymentRef } },
      { new: true }
    ).exec();
  }

  async getBookingById(bookingId: string) {
    return await BookingModel.findById(bookingId).exec();
  }

  async updatePaymentVerification(
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

  async createPaymentRecord(payload: {
    bookingId: string;
    studentId: string;
    gateway: "khalti" | "esewa";
    amount: number;
    paymentRef: string;
    gatewayRef?: string;
    rawInitiateResponse?: Record<string, any>;
  }) {
    return await PaymentModel.create({
      bookingId: new mongoose.Types.ObjectId(payload.bookingId),
      studentId: new mongoose.Types.ObjectId(payload.studentId),
      gateway: payload.gateway,
      amount: payload.amount,
      paymentRef: payload.paymentRef,
      gatewayRef: payload.gatewayRef,
      status: "pending",
      initiatedAt: new Date(),
      rawInitiateResponse: payload.rawInitiateResponse,
    });
  }

  async getPaymentByBookingIdAndStudent(bookingId: string, studentId: string) {
    return await PaymentModel.findOne({
      bookingId: new mongoose.Types.ObjectId(bookingId),
      studentId: new mongoose.Types.ObjectId(studentId),
    })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getPaymentByPaymentRefAndStudent(paymentRef: string, studentId: string) {
    return await PaymentModel.findOne({
      paymentRef,
      studentId: new mongoose.Types.ObjectId(studentId),
    })
      .sort({ createdAt: -1 })
      .exec();
  }

  async updatePaymentRecord(
    paymentId: string,
    payload: {
      status: "pending" | "paid" | "failed";
      gatewayTxnId?: string;
      rawVerifyResponse?: Record<string, any>;
    }
  ) {
    return await PaymentModel.findByIdAndUpdate(
      paymentId,
      {
        $set: {
          status: payload.status,
          gatewayTxnId: payload.gatewayTxnId,
          rawVerifyResponse: payload.rawVerifyResponse,
          verifiedAt: new Date(),
        },
      },
      { new: true }
    ).exec();
  }

  async updatePaymentGatewayReference(paymentId: string, gatewayRef: string) {
    return await PaymentModel.findByIdAndUpdate(
      paymentId,
      {
        $set: { gatewayRef },
      },
      { new: true }
    ).exec();
  }
}
