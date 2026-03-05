import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { MessageModel } from "../../models/message.model";
import { SavedTutorModel } from "../../models/saved-tutor.model";

const TEST_PREFIX = "msgsavedtest_";

function buildUserPayload(label: string) {
  const unique = `${TEST_PREFIX}${label}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    fullName: `MsgSaved ${label}`,
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
  if (!user) throw new Error("user creation failed");

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

describe("Message And Saved Tutor Controller Integration", () => {
  afterAll(async () => {
    const users = await UserModel.find({
      $or: [
        { email: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
        { username: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
      ],
    }).select("_id");

    const ids = users.map((u) => u._id);
    if (ids.length) {
      await MessageModel.deleteMany({
        $or: [{ studentId: { $in: ids } }, { tutorId: { $in: ids } }],
      });
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

  it("supports message send, reply, and inbox retrieval", async () => {
    const student = await createUserAndLogin("user");
    const tutor = await createUserAndLogin("tutor");

    const sendRes = await request(app)
      .post("/api/messages")
      .set("Authorization", `Bearer ${student.token}`)
      .send({ tutorId: tutor.userId, content: "Need help in math" });

    expect(sendRes.status).toBe(201);
    expect(sendRes.body.success).toBe(true);

    const tutorInbox = await request(app)
      .get("/api/messages/tutor")
      .set("Authorization", `Bearer ${tutor.token}`);

    expect(tutorInbox.status).toBe(200);
    expect(tutorInbox.body.success).toBe(true);
    expect(Array.isArray(tutorInbox.body.data)).toBe(true);

    const replyRes = await request(app)
      .post("/api/messages/reply")
      .set("Authorization", `Bearer ${tutor.token}`)
      .send({ studentId: student.userId, content: "Sure, let's schedule." });

    expect(replyRes.status).toBe(201);
    expect(replyRes.body.success).toBe(true);

    const studentInbox = await request(app)
      .get("/api/messages/student")
      .set("Authorization", `Bearer ${student.token}`);

    expect(studentInbox.status).toBe(200);
    expect(studentInbox.body.success).toBe(true);
    expect(Array.isArray(studentInbox.body.data)).toBe(true);
  });

  it("supports save tutor list and remove", async () => {
    const student = await createUserAndLogin("user");
    const tutor = await createUserAndLogin("tutor");

    const saveRes = await request(app)
      .post("/api/saved-tutors")
      .set("Authorization", `Bearer ${student.token}`)
      .send({ tutorId: tutor.userId });

    expect(saveRes.status).toBe(201);
    expect(saveRes.body.success).toBe(true);

    const listRes = await request(app)
      .get("/api/saved-tutors/my")
      .set("Authorization", `Bearer ${student.token}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.success).toBe(true);
    expect(Array.isArray(listRes.body.data)).toBe(true);

    const removeRes = await request(app)
      .delete(`/api/saved-tutors/${tutor.userId}`)
      .set("Authorization", `Bearer ${student.token}`);

    expect(removeRes.status).toBe(200);
    expect(removeRes.body.success).toBe(true);
  });
});
