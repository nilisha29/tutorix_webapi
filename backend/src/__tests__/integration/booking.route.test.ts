import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { BookingModel } from "../../models/booking.model";

const TEST_PREFIX = "bookingroutetest_";

function buildUserPayload(label: string) {
  const unique = `${TEST_PREFIX}${label}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    fullName: `Booking Route ${label}`,
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

  const registerRes = await request(app).post("/api/auth/register").send(payload);
  if (registerRes.status !== 201) {
    throw new Error("Failed to register user for route test");
  }

  const created = await UserModel.findOne({ email: payload.email });
  if (!created) {
    throw new Error("User not found after registration");
  }

  if (role === "tutor") {
    await UserModel.findByIdAndUpdate(String(created._id), {
      $set: { role: "tutor", tutorOrigin: "self" },
    });
  }

  const loginRes = await request(app).post("/api/auth/login").send({
    email: payload.email,
    password: payload.password,
  });

  return {
    token: String(loginRes.body.token || ""),
    userId: String(created._id),
  };
}

describe("Booking Route Integration", () => {
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

  it("protects booking routes with authorized middleware", async () => {
    const createRes = await request(app).post("/api/bookings").send({});
    expect(createRes.status).toBe(401);

    const studentRes = await request(app).get("/api/bookings/my-student");
    expect(studentRes.status).toBe(401);

    const tutorRes = await request(app).get("/api/bookings/my-tutor");
    expect(tutorRes.status).toBe(401);
  });

  it("protects nested payment routes under /api/bookings/payments", async () => {
    const initRes = await request(app).post("/api/bookings/payments/initiate").send({});
    expect(initRes.status).toBe(401);

    const verifyRes = await request(app).post("/api/bookings/payments/verify").send({});
    expect(verifyRes.status).toBe(401);
  });

  it("routes payment initiate/verify requests to controllers and DTO validation", async () => {
    const student = await createUserAndLogin("user");

    const invalidInitiate = await request(app)
      .post("/api/bookings/payments/initiate")
      .set("Authorization", `Bearer ${student.token}`)
      .send({ amount: -1 });

    expect(invalidInitiate.status).toBe(400);
    expect(invalidInitiate.body.success).toBe(false);

    const invalidVerify = await request(app)
      .post("/api/bookings/payments/verify")
      .set("Authorization", `Bearer ${student.token}`)
      .send({ status: "failed" });

    expect(invalidVerify.status).toBe(400);
    expect(invalidVerify.body.success).toBe(false);
  });

  it("creates booking and exposes it through my-student and my-tutor routes", async () => {
    const student = await createUserAndLogin("user");
    const tutor = await createUserAndLogin("tutor");

    const createRes = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${student.token}`)
      .send({
        tutorId: tutor.userId,
        date: "2026-03-05",
        time: "16:00",
        duration: "60",
        paymentMethod: "khalti",
        amount: 500,
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);

    const studentBookings = await request(app)
      .get("/api/bookings/my-student")
      .set("Authorization", `Bearer ${student.token}`);

    expect(studentBookings.status).toBe(200);
    expect(studentBookings.body.success).toBe(true);
    expect(Array.isArray(studentBookings.body.data)).toBe(true);
    expect(studentBookings.body.data.length).toBeGreaterThanOrEqual(1);

    const tutorBookings = await request(app)
      .get("/api/bookings/my-tutor")
      .set("Authorization", `Bearer ${tutor.token}`);

    expect(tutorBookings.status).toBe(200);
    expect(tutorBookings.body.success).toBe(true);
    expect(Array.isArray(tutorBookings.body.data)).toBe(true);
    expect(tutorBookings.body.data.length).toBeGreaterThanOrEqual(1);
  });
});
