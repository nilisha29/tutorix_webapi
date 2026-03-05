import { initiatePayment, verifyPayment } from "@/lib/api/payment";
import { API } from "@/lib/api/endpoints";
import axios from "@/lib/api/axios";

jest.mock("@/lib/api/axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

describe("payment api helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initiatePayment posts payload", async () => {
    const payload = {
      tutorId: "t1",
      date: "2026-03-05",
      time: "10:00",
      duration: "60",
      paymentMethod: "esewa" as const,
      amount: 1500,
    };
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    await initiatePayment(payload);

    expect(axios.post).toHaveBeenCalledWith(API.BOOKINGS.PAYMENTS.INITIATE, payload);
  });

  it("verifyPayment posts verification payload", async () => {
    const payload = {
      bookingId: "b1",
      provider: "khalti" as const,
      paymentRef: "ref-1",
      status: "success",
    };
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    await verifyPayment(payload);

    expect(axios.post).toHaveBeenCalledWith(API.BOOKINGS.PAYMENTS.VERIFY, payload);
  });
});
