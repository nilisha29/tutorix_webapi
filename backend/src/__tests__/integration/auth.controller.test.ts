import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";

const TEST_PREFIX = "authctltest_";

function buildUserPayload() {
  const unique = `${TEST_PREFIX}${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    fullName: "Auth Controller User",
    email: `${unique}@example.com`,
    username: unique,
    password: "password123",
    confirmPassword: "password123",
    phoneNumber: "9800000000",
    address: "Kathmandu",
  };
}


describe("Auth Controller Integration", () => {
  afterAll(async () => {
    await UserModel.deleteMany({
      $or: [
        { email: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
        { username: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
      ],
    });
  });

  it("returns 400 when login payload is invalid", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "not-an-email",
      password: "123",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 when forgot-password email is missing", async () => {
    const res = await request(app).post("/api/auth/forgot-password").send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/email is required/i);
  });

  it("returns 400 when reset-password token/password is missing", async () => {
    const res = await request(app).post("/api/auth/reset-password").send({
      token: "",
      password: "",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/token and new password are required/i);
  });

  it("returns 401 for change-password without bearer token", async () => {
    const res = await request(app).put("/api/auth/change-password").send({
      currentPassword: "password123",
      newPassword: "newpassword123",
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(String(res.body.message || "")).toMatch(/unauthorized/i);
  });

  it("returns 401 for whoami without bearer token", async () => {
    const res = await request(app).get("/api/auth/whoami");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("returns 200 for whoami with valid bearer token", async () => {
    const payload = buildUserPayload();

    const registerRes = await request(app).post("/api/auth/register").send(payload);
    expect(registerRes.status).toBe(201);

    const loginRes = await request(app).post("/api/auth/login").send({
      email: payload.email,
      password: payload.password,
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);

    const token = String(loginRes.body.token || "");
    expect(token).toBeTruthy();

    const whoAmIRes = await request(app)
      .get("/api/auth/whoami")
      .set("Authorization", `Bearer ${token}`);

    expect(whoAmIRes.status).toBe(200);
    expect(whoAmIRes.body.success).toBe(true);
    expect(whoAmIRes.body.data.email).toBe(payload.email);
  });
});
