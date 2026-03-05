import {
  createBooking,
  initiateBookingPayment,
  getMyTutorBookings,
  updateBookingByIdForAdmin,
  deleteBookingByIdForAdmin,
} from "@/lib/api/booking";
import { API } from "@/lib/api/endpoints";
import axios from "@/lib/api/axios";

jest.mock("@/lib/api/axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    put: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("booking api helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createBooking posts payload", async () => {
    const payload = {
      tutorId: "t1",
      date: "2026-03-05",
      time: "10:00",
      duration: "60",
      paymentMethod: "esewa" as const,
      amount: 1000,
    };
    const responseData = { success: true };
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: responseData });

    const result = await createBooking(payload);

    expect(axios.post).toHaveBeenCalledWith(API.BOOKINGS.CREATE, payload);
    expect(result).toEqual(responseData);
  });

  it("initiateBookingPayment posts payload", async () => {
    const payload = {
      tutorId: "t1",
      date: "2026-03-05",
      time: "10:00",
      duration: "60",
      paymentMethod: "khalti" as const,
      amount: 2000,
    };
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: { ok: true } });

    await initiateBookingPayment(payload);

    expect(axios.post).toHaveBeenCalledWith(API.BOOKINGS.PAYMENTS.INITIATE, payload);
  });

  it("getMyTutorBookings gets tutor bookings", async () => {
    const responseData = { success: true, data: [] };
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: responseData });

    const result = await getMyTutorBookings();

    expect(axios.get).toHaveBeenCalledWith(API.BOOKINGS.MY_TUTOR);
    expect(result).toEqual(responseData);
  });

  it("updateBookingByIdForAdmin puts update payload", async () => {
    const payload = { bookingStatus: "confirmed" as const };
    (axios.put as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    await updateBookingByIdForAdmin("b1", payload);

    expect(axios.put).toHaveBeenCalledWith(API.ADMIN.BOOKINGS.UPDATE("b1"), payload);
  });

  it("deleteBookingByIdForAdmin deletes by id", async () => {
    (axios.delete as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    await deleteBookingByIdForAdmin("b1");

    expect(axios.delete).toHaveBeenCalledWith(API.ADMIN.BOOKINGS.DELETE("b1"));
  });
});
