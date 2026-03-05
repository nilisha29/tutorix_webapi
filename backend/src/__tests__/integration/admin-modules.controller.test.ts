import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { BookingModel } from "../../models/booking.model";

const TEST_PREFIX = "admintest_";

function buildUserPayload(label: string) {
  const unique = `${TEST_PREFIX}${label}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    fullName: `AdminTest ${label}`,
    email: `${unique}@example.com`,
    username: unique,
    password: "password123",
    confirmPassword: "password123",
    phoneNumber: "9800000000",
    address: "Kathmandu",
  };
}


async function createUserAndLogin(role: "user" | "admin" | "tutor" = "user") {
  const payload = buildUserPayload(role);
  await request(app).post("/api/auth/register").send(payload);
  const user = await UserModel.findOne({ email: payload.email });
  if (!user) throw new Error("user creation failed");

  if (role !== "user") {
    await UserModel.findByIdAndUpdate(String(user._id), {
      $set: {
        role,
        ...(role === "tutor" ? { tutorOrigin: "self" } : {}),
      },
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

describe("Admin Modules Controller Integration", () => {
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

  it("supports admin user CRUD endpoints", async () => {
    const admin = await createUserAndLogin("admin");
    const userPayload = buildUserPayload("managed");

    const createRes = await request(app)
      .post("/api/admin/users")
      .set("Authorization", `Bearer ${admin.token}`)
      .send(userPayload);

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);

    const managedUserId = String(createRes.body.data?._id || "");
    expect(managedUserId).toBeTruthy();

    const getRes = await request(app)
      .get(`/api/admin/users/${managedUserId}`)
      .set("Authorization", `Bearer ${admin.token}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.success).toBe(true);

    const updateRes = await request(app)
      .put(`/api/admin/users/${managedUserId}`)
      .set("Authorization", `Bearer ${admin.token}`)
      .send({ fullName: "Managed Updated" });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.success).toBe(true);

    const deleteRes = await request(app)
      .delete(`/api/admin/users/${managedUserId}`)
      .set("Authorization", `Bearer ${admin.token}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);
  });

  it("supports admin tutor CRUD endpoints", async () => {
    const admin = await createUserAndLogin("admin");
    const tutorPayload = buildUserPayload("managedtutor");

    const createRes = await request(app)
      .post("/api/admin/tutors")
      .set("Authorization", `Bearer ${admin.token}`)
      .send({ ...tutorPayload, role: "tutor" });

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);

    const tutorId = String(createRes.body.data?._id || "");

    const updateRes = await request(app)
      .put(`/api/admin/tutors/${tutorId}`)
      .set("Authorization", `Bearer ${admin.token}`)
      .send({ fullName: "Tutor Updated" });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.success).toBe(true);

    const deleteRes = await request(app)
      .delete(`/api/admin/tutors/${tutorId}`)
      .set("Authorization", `Bearer ${admin.token}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);
  });

  it("supports admin booking and payment list endpoints", async () => {
    const admin = await createUserAndLogin("admin");
    const student = await createUserAndLogin("user");
    const tutor = await createUserAndLogin("tutor");

    const createBookingRes = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${student.token}`)
      .send({
        tutorId: tutor.userId,
        date: "2026-03-05",
        time: "11:00",
        duration: "45",
        paymentMethod: "khalti",
        amount: 450,
      });

    expect(createBookingRes.status).toBe(201);

    const bookingId = String(createBookingRes.body.data?._id || "");

    const adminBookingsRes = await request(app)
      .get("/api/admin/bookings")
      .set("Authorization", `Bearer ${admin.token}`);

    expect(adminBookingsRes.status).toBe(200);
    expect(adminBookingsRes.body.success).toBe(true);

    const getBookingRes = await request(app)
      .get(`/api/admin/bookings/${bookingId}`)
      .set("Authorization", `Bearer ${admin.token}`);

    expect(getBookingRes.status).toBe(200);
    expect(getBookingRes.body.success).toBe(true);

    const adminPaymentsRes = await request(app)
      .get("/api/admin/payments")
      .set("Authorization", `Bearer ${admin.token}`);

    expect(adminPaymentsRes.status).toBe(200);
    expect(adminPaymentsRes.body.success).toBe(true);

    const getPaymentRes = await request(app)
      .get(`/api/admin/payments/${bookingId}`)
      .set("Authorization", `Bearer ${admin.token}`);

    expect(getPaymentRes.status).toBe(200);
    expect(getPaymentRes.body.success).toBe(true);
  });
});
