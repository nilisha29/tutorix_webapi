export type PaymentStatus = "pending" | "paid" | "failed";

export interface IPaymentRecord {
  bookingId: string;
  paymentRef?: string;
  gatewayTxnId?: string;
  paymentStatus: PaymentStatus;
  bookingStatus: "pending" | "confirmed" | "cancelled" | "completed";
}
