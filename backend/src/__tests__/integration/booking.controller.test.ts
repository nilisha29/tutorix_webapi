import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { BookingModel } from "../../models/booking.model";

const TEST_PREFIX = "bookingtest_";

function buildUserPayload(label: string) {
  const unique = `${TEST_PREFIX}${label}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    fullName: `Booking ${label}`,
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

describe("Booking Controller Integration", () => {
  afterAll(async () => {
    const users = await UserModel.find({
      $or: [
        { email: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
        { username: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
      ],
    }).select("_id");

    const ids = users.map((u) => u._id);
    if (ids.length) {
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

  it("creates booking with valid tutor and allows student/tutor listing", async () => {
    const student = await createUserAndLogin("user");
    const tutor = await createUserAndLogin("tutor");

    const createRes = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${student.token}`)
      .send({
        tutorId: tutor.userId,
        date: "2026-03-05",
        time: "09:30",
        duration: "60",
        paymentMethod: "khalti",
        amount: 500,
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);

    const studentList = await request(app)
      .get("/api/bookings/my-student")
      .set("Authorization", `Bearer ${student.token}`);

    expect(studentList.status).toBe(200);
    expect(studentList.body.success).toBe(true);
    expect(Array.isArray(studentList.body.data)).toBe(true);

    const tutorList = await request(app)
      .get("/api/bookings/my-tutor")
      .set("Authorization", `Bearer ${tutor.token}`);

    expect(tutorList.status).toBe(200);
    expect(tutorList.body.success).toBe(true);
    expect(Array.isArray(tutorList.body.data)).toBe(true);
  });

  it("returns 404 when booking with non-tutor target", async () => {
    const student = await createUserAndLogin("user");
    const nonTutor = await createUserAndLogin("user");

    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${student.token}`)
      .send({
        tutorId: nonTutor.userId,
        date: "2026-03-05",
        time: "10:00",
        duration: "30",
        paymentMethod: "esewa",
        amount: 300,
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("returns 401 for payment initiate/verify without auth", async () => {
    const initRes = await request(app).post("/api/bookings/payments/initiate").send({});
    expect(initRes.status).toBe(401);
    expect(initRes.body.success).toBe(false);

    const verifyRes = await request(app).post("/api/bookings/payments/verify").send({});
    expect(verifyRes.status).toBe(401);
    expect(verifyRes.body.success).toBe(false);
  });
});
