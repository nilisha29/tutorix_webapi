import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";

const TEST_PREFIX = "tutorroutetest_";

function buildUserPayload(label: string) {
  const unique = `${TEST_PREFIX}${label}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    fullName: `Tutor Route ${label}`,
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

  const created = await UserModel.findOne({ email: payload.email });
  if (!created) throw new Error("user create failed");

  if (role !== "user") {
    await UserModel.findByIdAndUpdate(String(created._id), {
      $set: { role, ...(role === "tutor" ? { tutorOrigin: "self" } : {}) },
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

describe("Tutor Route Integration", () => {
  afterAll(async () => {
    await UserModel.deleteMany({
      $or: [
        { email: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
        { username: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
      ],
    });
  });

  it("returns tutor detail for tutor id and 404 for non-tutor id", async () => {
    const tutor = await createUserAndLogin("tutor");
    const user = await createUserAndLogin("user");

    expect((await request(app).get(`/api/tutors/${tutor.userId}`)).status).toBe(200);
    expect((await request(app).get(`/api/tutors/${user.userId}`)).status).toBe(404);
  });

  it("protects nested review route and supports add review for auth user", async () => {
    const tutor = await createUserAndLogin("tutor");
    const student = await createUserAndLogin("user");

    const unauth = await request(app)
      .post(`/api/tutors/${tutor.userId}/reviews`)
      .send({ quote: "Great", rating: 5 });
    expect(unauth.status).toBe(401);

    const badPayload = await request(app)
      .post(`/api/tutors/${tutor.userId}/reviews`)
      .set("Authorization", `Bearer ${student.token}`)
      .send({ quote: "a", rating: 9 });
    expect(badPayload.status).toBe(400);

    const ok = await request(app)
      .post(`/api/tutors/${tutor.userId}/reviews`)
      .set("Authorization", `Bearer ${student.token}`)
      .send({ quote: "Great tutor", rating: 5 });
    expect(ok.status).toBe(200);
    expect(ok.body.success).toBe(true);
  });
});