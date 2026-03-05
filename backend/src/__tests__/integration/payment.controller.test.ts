import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { BookingModel } from "../../models/booking.model";
import { PaymentModel } from "../../models/payment.model";

const TEST_PREFIX = "paymenttest_";

function buildUserPayload(label: string) {
  const unique = `${TEST_PREFIX}${label}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    fullName: `Payment ${label}`,
    email: `${unique}@example.com`,
    username: unique,
    password: "password123",
    confirmPassword: "password123",
    phoneNumber: "9800000000",
    address: "Kathmandu",
  };
}

async function createUserAndLogin(role: "user" | "tutor" = "user") {
  const payload = buildUserPayload(role);
  await request(app).post("/api/auth/register").send(payload);

  const user = await UserModel.findOne({ email: payload.email });
  if (!user) {
    throw new Error("User creation failed");
  }

  if (role === "tutor") {
    await UserModel.findByIdAndUpdate(String(user._id), {
      $set: { role: "tutor", tutorOrigin: "self" },
    });
  }

  const loginRes = await request(app).post("/api/auth/login").send({
    email: payload.email,
    password: payload.password,
  });

  return {
    token: String(loginRes.body.token || ""),
    userId: String(user._id),
  };
}

describe("Payment Controller Integration", () => {
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

  it("returns 401 for initiate and verify without auth", async () => {
    const initRes = await request(app).post("/api/bookings/payments/initiate").send({});
    expect(initRes.status).toBe(401);
    expect(initRes.body.success).toBe(false);

    const verifyRes = await request(app).post("/api/bookings/payments/verify").send({});
    expect(verifyRes.status).toBe(401);
    expect(verifyRes.body.success).toBe(false);
  });

  it("returns 400 for invalid initiate payload", async () => {
    const student = await createUserAndLogin("user");

    const res = await request(app)
      .post("/api/bookings/payments/initiate")
      .set("Authorization", `Bearer ${student.token}`)
      .send({
        tutorId: "",
        amount: -1,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 for verify payload missing bookingId/paymentRef", async () => {
    const student = await createUserAndLogin("user");

    const res = await request(app)
      .post("/api/bookings/payments/verify")
      .set("Authorization", `Bearer ${student.token}`)
      .send({ status: "failed" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("verifies failed payment callback and updates booking/payment status", async () => {
    const student = await createUserAndLogin("user");
    const tutor = await createUserAndLogin("tutor");

    const booking = await BookingModel.create({
      studentId: student.userId,
      tutorId: tutor.userId,
      date: "2026-03-05",
      time: "12:00",
      duration: "60",
      paymentMethod: "khalti",
      amount: 700,
      paymentRef: `PAY-${Date.now()}-FAIL`,
      paymentStatus: "pending",
      bookingStatus: "pending",
    });

    await PaymentModel.create({
      bookingId: booking._id,
      studentId: student.userId,
      gateway: "khalti",
      amount: 700,
      paymentRef: booking.paymentRef,
      status: "pending",
      initiatedAt: new Date(),
    });

    const verifyRes = await request(app)
      .post("/api/bookings/payments/verify")
      .set("Authorization", `Bearer ${student.token}`)
      .send({
        bookingId: String(booking._id),
        status: "failed",
        gatewayTxnId: "GTX-FAILED-001",
      });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.success).toBe(true);
    expect(verifyRes.body.data.verified).toBe(false);

    const updatedBooking = await BookingModel.findById(booking._id);
    const updatedPayment = await PaymentModel.findOne({ bookingId: booking._id });

    expect(updatedBooking?.paymentStatus).toBe("failed");
    expect(updatedBooking?.bookingStatus).toBe("pending");
    expect(updatedPayment?.status).toBe("failed");
  });

  it("returns 403 when student verifies another student's booking", async () => {
    const studentA = await createUserAndLogin("user");
    const studentB = await createUserAndLogin("user");
    const tutor = await createUserAndLogin("tutor");

    const booking = await BookingModel.create({
      studentId: studentB.userId,
      tutorId: tutor.userId,
      date: "2026-03-06",
      time: "14:00",
      duration: "45",
      paymentMethod: "esewa",
      amount: 550,
      paymentRef: `PAY-${Date.now()}-FORBID`,
      paymentStatus: "pending",
      bookingStatus: "pending",
    });

    await PaymentModel.create({
      bookingId: booking._id,
      studentId: studentB.userId,
      gateway: "esewa",
      amount: 550,
      paymentRef: booking.paymentRef,
      status: "pending",
      initiatedAt: new Date(),
    });

    const verifyRes = await request(app)
      .post("/api/bookings/payments/verify")
      .set("Authorization", `Bearer ${studentA.token}`)
      .send({
        bookingId: String(booking._id),
        status: "failed",
      });

    expect(verifyRes.status).toBe(403);
    expect(verifyRes.body.success).toBe(false);
  });
});
