import mongoose, { Document, Schema } from "mongoose";

export type PaymentGateway = "khalti" | "esewa";
export type PaymentStatus = "pending" | "paid" | "failed";

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  gateway: PaymentGateway;
  amount: number;
  paymentRef: string;
  gatewayRef?: string;
  gatewayTxnId?: string;
  status: PaymentStatus;
  initiatedAt: Date;
  verifiedAt?: Date;
  rawInitiateResponse?: Record<string, any>;
  rawVerifyResponse?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    gateway: {
      type: String,
      enum: ["khalti", "esewa"],
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentRef: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    gatewayRef: {
      type: String,
      required: false,
      trim: true,
    },
    gatewayTxnId: {
      type: String,
      required: false,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      index: true,
    },
    initiatedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    verifiedAt: {
      type: Date,
      required: false,
    },
    rawInitiateResponse: {
      type: Schema.Types.Mixed,
      required: false,
    },
    rawVerifyResponse: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);
