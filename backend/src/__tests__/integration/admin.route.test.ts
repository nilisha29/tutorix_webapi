import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";

const TEST_PREFIX = "adminroutetest_";

function buildUserPayload(label: string) {
  const unique = `${TEST_PREFIX}${label}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    fullName: `Admin Route ${label}`,
    email: `${unique}@example.com`,
    username: unique,
    password: "password123",
    confirmPassword: "password123",
    phoneNumber: "9800000000",
    address: "Kathmandu",
  };
}

async function createUserAndLogin(role: "user" | "admin" = "user") {
  const payload = buildUserPayload(role);
  await request(app).post("/api/auth/register").send(payload);

  const created = await UserModel.findOne({ email: payload.email });
  if (!created) throw new Error("user create failed");

  if (role === "admin") {
    await UserModel.findByIdAndUpdate(String(created._id), {
      $set: { role: "admin" },
    });
  }

  const loginRes = await request(app).post("/api/auth/login").send({
    email: payload.email,
    password: payload.password,
  });

  return {
    token: String(loginRes.body.token || ""),
  };
}

describe("Admin Route Integration", () => {
  afterAll(async () => {
    await UserModel.deleteMany({
      $or: [
        { email: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
        { username: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
      ],
    });
  });

  it("returns 401 for admin routes without token", async () => {
    const targets = [
      "/api/admin/users",
      "/api/admin/bookings",
      "/api/admin/payments",
      "/api/admin/reviews",
      "/api/admin/tutors",
    ];

    for (const path of targets) {
      const res = await request(app).get(path);
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    }
  });

  it("returns 403 for non-admin token on admin routes", async () => {
    const user = await createUserAndLogin("user");
    const targets = [
      "/api/admin/users",
      "/api/admin/bookings",
      "/api/admin/payments",
      "/api/admin/reviews",
      "/api/admin/tutors",
    ];

    for (const path of targets) {
      const res = await request(app)
        .get(path)
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    }
  });

  it("allows admin token on admin list routes", async () => {
    const admin = await createUserAndLogin("admin");
    const targets = [
      "/api/admin/users",
      "/api/admin/bookings",
      "/api/admin/payments",
      "/api/admin/reviews",
      "/api/admin/tutors",
    ];

    for (const path of targets) {
      const res = await request(app)
        .get(path)
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    }
  });
});