import { PaymentService } from "../../services/payment.service";
import { UserModel } from "../../models/user.model";
import { BookingModel } from "../../models/booking.model";
import { PaymentModel } from "../../models/payment.model";

const TEST_PREFIX = "payservtest_";
const paymentService = new PaymentService();

function uniqueBase(label: string) {
  return `${TEST_PREFIX}${label}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}


async function createUser(role: "user" | "tutor" = "user") {
  const base = uniqueBase(role);
  return await UserModel.create({
    fullName: `Payment Service ${role}`,
    email: `${base}@example.com`,
    username: base,
    password: "password123",
    phoneNumber: "9800000000",
    address: "Kathmandu",
    role,
    ...(role === "tutor" ? { tutorOrigin: "self" } : {}),
  });
}

describe("Payment Service", () => {
  afterAll(async () => {
    const users = await UserModel.find({
      $or: [
        { email: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
        { username: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
      ],
    }).select("_id");

    const ids = users.map((u) => u._id);
    if (ids.length > 0) {
      const bookings = await BookingModel.find({
        $or: [{ studentId: { $in: ids } }, { tutorId: { $in: ids } }],
      }).select("_id");

      const bookingIds = bookings.map((b) => b._id);
      if (bookingIds.length > 0) {
        await PaymentModel.deleteMany({ bookingId: { $in: bookingIds } });
      }

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

  it("throws when initiatePayment target tutor does not exist", async () => {
    const student = await createUser("user");

    await expect(
      paymentService.initiatePayment(String(student._id), {
        tutorId: "67c8f8f8f8f8f8f8f8f8f8f8",
        date: "2026-03-05",
        time: "10:00",
        duration: "60",
        paymentMethod: "khalti",
        amount: 500,
      })
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Tutor not found",
    });
  });

  it("verifies failed status path and marks booking/payment failed", async () => {
    const student = await createUser("user");
    const tutor = await createUser("tutor");

    const booking = await BookingModel.create({
      studentId: student._id,
      tutorId: tutor._id,
      date: "2026-03-06",
      time: "11:00",
      duration: "45",
      paymentMethod: "khalti",
      amount: 550,
      paymentRef: `PAY-${Date.now()}-FAIL`,
      paymentStatus: "pending",
      bookingStatus: "pending",
    });

    const payment = await PaymentModel.create({
      bookingId: booking._id,
      studentId: student._id,
      gateway: "khalti",
      amount: 550,
      paymentRef: booking.paymentRef,
      status: "pending",
      initiatedAt: new Date(),
    });

    const result = await paymentService.verifyPayment(String(student._id), {
      bookingId: String(booking._id),
      status: "failed",
      gatewayTxnId: "GTX-FAIL-01",
    });

    expect(result.verified).toBe(false);
    expect(result.booking?.paymentStatus).toBe("failed");
    expect(result.payment?.status).toBe("failed");

    const latestPayment = await PaymentModel.findById(payment._id);
    expect(latestPayment?.status).toBe("failed");
  });

  it("throws 403 when verifying another student's payment", async () => {
    const studentA = await createUser("user");
    const studentB = await createUser("user");
    const tutor = await createUser("tutor");

    const booking = await BookingModel.create({
      studentId: studentB._id,
      tutorId: tutor._id,
      date: "2026-03-07",
      time: "09:00",
      duration: "60",
      paymentMethod: "esewa",
      amount: 700,
      paymentRef: `PAY-${Date.now()}-FORBID`,
      paymentStatus: "pending",
      bookingStatus: "pending",
    });

    await PaymentModel.create({
      bookingId: booking._id,
      studentId: studentB._id,
      gateway: "esewa",
      amount: 700,
      paymentRef: booking.paymentRef,
      status: "pending",
      initiatedAt: new Date(),
    });

    await expect(
      paymentService.verifyPayment(String(studentA._id), {
        bookingId: String(booking._id),
        status: "failed",
      })
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "You are not allowed to verify this booking",
    });
  });
}
);