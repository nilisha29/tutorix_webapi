import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { SavedTutorModel } from "../../models/saved-tutor.model";

const TEST_PREFIX = "savedroutetest_";

function buildUserPayload(label: string) {
  const unique = `${TEST_PREFIX}${label}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    fullName: `Saved Route ${label}`,
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

  const created = await UserModel.findOne({ email: payload.email });
  if (!created) throw new Error("user create failed");

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

describe("Saved Tutor Route Integration", () => {
  afterAll(async () => {
    const users = await UserModel.find({
      $or: [
        { email: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
        { username: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
      ],
    }).select("_id");

    const ids = users.map((u) => u._id);
    if (ids.length > 0) {
      await SavedTutorModel.deleteMany({
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

  it("protects saved tutor routes without auth", async () => {
    expect((await request(app).post("/api/saved-tutors").send({})).status).toBe(401);
    expect((await request(app).get("/api/saved-tutors/my")).status).toBe(401);
    expect((await request(app).delete("/api/saved-tutors/abc")).status).toBe(401);
  });

  it("supports save/list/remove route flow", async () => {
    const student = await createUserAndLogin("user");
    const tutor = await createUserAndLogin("tutor");

    const saveRes = await request(app)
      .post("/api/saved-tutors")
      .set("Authorization", `Bearer ${student.token}`)
      .send({ tutorId: tutor.userId });
    expect(saveRes.status).toBe(201);

    const listRes = await request(app)
      .get("/api/saved-tutors/my")
      .set("Authorization", `Bearer ${student.token}`);
    expect(listRes.status).toBe(200);

    const removeRes = await request(app)
      .delete(`/api/saved-tutors/${tutor.userId}`)
      .set("Authorization", `Bearer ${student.token}`);
    expect(removeRes.status).toBe(200);
  });
});