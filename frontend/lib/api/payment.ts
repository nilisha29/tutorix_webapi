import axios from "./axios";
import { API } from "./endpoints";

export const initiatePayment = async (payload: {
  tutorId: string;
  date: string;
  time: string;
  duration: string;
  paymentMethod: "esewa" | "khalti";
  amount: number;
}) => {
  const response = await axios.post(API.BOOKINGS.PAYMENTS.INITIATE, payload);
  return response.data;
};


export const verifyPayment = async (payload: {
  bookingId: string;
  provider?: "esewa" | "khalti";
  paymentRef?: string;
  status?: string;
  pidx?: string;
  transactionUuid?: string;
  gatewayTxnId?: string;
}) => {
  const response = await axios.post(API.BOOKINGS.PAYMENTS.VERIFY, payload);
  return response.data;
};
