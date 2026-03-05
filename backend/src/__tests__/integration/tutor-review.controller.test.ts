import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";

const TEST_PREFIX = "tutorrevtest_";

function buildUserPayload(label: string) {
  const unique = `${TEST_PREFIX}${label}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    fullName: `TutorReview ${label}`,
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

describe("Tutor And Review Controller Integration", () => {
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

    const tutorRes = await request(app).get(`/api/tutors/${tutor.userId}`);
    expect(tutorRes.status).toBe(200);
    expect(tutorRes.body.success).toBe(true);

    const userRes = await request(app).get(`/api/tutors/${user.userId}`);
    expect(userRes.status).toBe(404);
    expect(userRes.body.success).toBe(false);
  });

  it("supports review add and admin moderation update/delete", async () => {
    const admin = await createUserAndLogin("admin");
    const student = await createUserAndLogin("user");
    const tutor = await createUserAndLogin("tutor");

    const addReviewRes = await request(app)
      .post(`/api/tutors/${tutor.userId}/reviews`)
      .set("Authorization", `Bearer ${student.token}`)
      .send({ quote: "Great support", rating: 5 });

    expect(addReviewRes.status).toBe(200);
    expect(addReviewRes.body.success).toBe(true);

    const updateRes = await request(app)
      .put(`/api/admin/reviews/${tutor.userId}/reviews/${student.userId}`)
      .set("Authorization", `Bearer ${admin.token}`)
      .send({ quote: "Updated support", rating: 4 });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.success).toBe(true);

    const deleteRes = await request(app)
      .delete(`/api/admin/reviews/${tutor.userId}/reviews/${student.userId}`)
      .set("Authorization", `Bearer ${admin.token}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);
  });
});
