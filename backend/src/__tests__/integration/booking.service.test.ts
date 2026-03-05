import { BookingService } from "../../services/booking.service";
import { UserModel } from "../../models/user.model";
import { BookingModel } from "../../models/booking.model";

const TEST_PREFIX = "bookingservtest_";
const bookingService = new BookingService();

function uniqueBase(label: string) {
  return `${TEST_PREFIX}${label}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function createUser(role: "user" | "tutor" = "user") {
  const base = uniqueBase(role);
  const user = await UserModel.create({
    fullName: `Booking Service ${role}`,
    email: `${base}@example.com`,
    username: base,
    password: "password123",
    phoneNumber: "9800000000",
    address: "Kathmandu",
    role,
    ...(role === "tutor" ? { tutorOrigin: "self" } : {}),
  });

  return user;
}

describe("Booking Service", () => {
  afterAll(async () => {
    const users = await UserModel.find({
      $or: [
        { email: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
        { username: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
      ],
    }).select("_id");

    const ids = users.map((u) => u._id);
    if (ids.length > 0) {
      await BookingModel.deleteMany({
        $or: [{ studentId: { $in: ids } }, { tutorId: { $in: ids } }],
      });
    }

    await UserModel.deleteMany({
      $or: [
        { email: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
        { username: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
      ],
    });
  });

  it("creates booking successfully for valid student and tutor", async () => {
    const student = await createUser("user");
    const tutor = await createUser("tutor");

    const booking = await bookingService.createBooking(String(student._id), {
      tutorId: String(tutor._id),
      date: "2026-03-05",
      time: "10:00",
      duration: "60",
      paymentMethod: "khalti",
      amount: 500,
    });

    expect(String(booking.studentId)).toBe(String(student._id));
    expect(String(booking.tutorId)).toBe(String(tutor._id));
    expect(booking.paymentStatus).toBe("pending");
    expect(booking.bookingStatus).toBe("pending");
  });

  it("throws 404 when tutor is not found", async () => {
    const student = await createUser("user");

    await expect(
      bookingService.createBooking(String(student._id), {
        tutorId: "67c8f8f8f8f8f8f8f8f8f8f8",
        date: "2026-03-05",
        time: "10:00",
        duration: "30",
        paymentMethod: "esewa",
        amount: 300,
      })
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Tutor not found",
    });
  });

  it("throws 400 when student id is invalid", async () => {
    const tutor = await createUser("tutor");

    await expect(
      bookingService.createBooking("invalid-student-id", {
        tutorId: String(tutor._id),
        date: "2026-03-05",
        time: "10:00",
        duration: "30",
        paymentMethod: "esewa",
        amount: 300,
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Invalid student id",
    });
  });

  it("throws 400 when user books own tutor profile", async () => {
    const tutor = await createUser("tutor");

    await expect(
      bookingService.createBooking(String(tutor._id), {
        tutorId: String(tutor._id),
        date: "2026-03-05",
        time: "10:00",
        duration: "30",
        paymentMethod: "khalti",
        amount: 300,
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "You cannot book your own session",
    });
  });

  it("initiates payment and persists booking payment reference", async () => {
    const student = await createUser("user");
    const tutor = await createUser("tutor");

    const result = await bookingService.initiatePayment(String(student._id), {
      tutorId: String(tutor._id),
      date: "2026-03-05",
      time: "12:00",
      duration: "60",
      paymentMethod: "khalti",
      amount: 700,
    });

    expect(result.paymentRef).toMatch(/^PAY-/);
    expect(result.redirectUrl).toContain("/payment/checkout");
    expect(result.successUrl).toContain("status=success");
    expect(result.failureUrl).toContain("status=failed");

    const updatedBooking = await BookingModel.findById(result.booking._id);
    expect(updatedBooking?.paymentRef).toBe(result.paymentRef);
  });

  it("verifies payment success and marks booking paid/confirmed", async () => {
    const student = await createUser("user");
    const tutor = await createUser("tutor");

    const booking = await bookingService.createBooking(String(student._id), {
      tutorId: String(tutor._id),
      date: "2026-03-05",
      time: "13:00",
      duration: "45",
      paymentMethod: "esewa",
      amount: 600,
    });

    const verified = await bookingService.verifyPayment(String(student._id), {
      bookingId: String(booking._id),
      status: "success",
      gatewayTxnId: "GTX-OK-001",
    });

    expect(verified.paymentStatus).toBe("paid");
    expect(verified.bookingStatus).toBe("confirmed");
  });

  it("throws 403 when verifying another student's booking", async () => {
    const studentA = await createUser("user");
    const studentB = await createUser("user");
    const tutor = await createUser("tutor");

    const booking = await bookingService.createBooking(String(studentB._id), {
      tutorId: String(tutor._id),
      date: "2026-03-05",
      time: "14:00",
      duration: "60",
      paymentMethod: "khalti",
      amount: 800,
    });

    await expect(
      bookingService.verifyPayment(String(studentA._id), {
        bookingId: String(booking._id),
        status: "failed",
      })
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "You are not allowed to verify this booking",
    });
  });

  it("supports admin-style update/get/delete booking methods", async () => {
    const student = await createUser("user");
    const tutor = await createUser("tutor");

    const booking = await bookingService.createBooking(String(student._id), {
      tutorId: String(tutor._id),
      date: "2026-03-05",
      time: "15:00",
      duration: "30",
      paymentMethod: "khalti",
      amount: 350,
    });

    const fetched = await bookingService.getBookingByIdForAdmin(String(booking._id));
    expect(String(fetched._id)).toBe(String(booking._id));

    const updated = await bookingService.updateBookingByIdForAdmin(String(booking._id), {
      bookingStatus: "confirmed",
      paymentStatus: "paid",
      amount: 400,
    });

    expect(updated.bookingStatus).toBe("confirmed");
    expect(updated.paymentStatus).toBe("paid");
    expect(updated.amount).toBe(400);

    const deleted = await bookingService.deleteBookingByIdForAdmin(String(booking._id));
    expect(deleted).toBe(true);

    await expect(
      bookingService.getBookingByIdForAdmin(String(booking._id))
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Booking not found",
    });
  });
});
