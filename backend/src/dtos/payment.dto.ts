import z from "zod";

export const InitiatePaymentDTO = z.object({
  tutorId: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  duration: z.string().min(1),
  paymentMethod: z.enum(["esewa", "khalti"]),
  amount: z.coerce.number().positive(),
});

export type InitiatePaymentDTO = z.infer<typeof InitiatePaymentDTO>;

export const VerifyPaymentDTO = z.object({
  bookingId: z.string().optional(),
  provider: z.enum(["esewa", "khalti"]).optional(),
  paymentRef: z.string().optional(),
  status: z.string().optional(),
  pidx: z.string().optional(),
  transactionUuid: z.string().optional(),
  gatewayTxnId: z.string().optional(),
}).refine(
  (data) => Boolean(data.bookingId || data.paymentRef || data.transactionUuid),
  {
    message: "bookingId or paymentRef is required",
    path: ["bookingId"],
  }
);

export type VerifyPaymentDTO = z.infer<typeof VerifyPaymentDTO>;
