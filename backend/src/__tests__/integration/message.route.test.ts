import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { MessageModel } from "../../models/message.model";

const TEST_PREFIX = "messageroutetest_";

function buildUserPayload(label: string) {
  const unique = `${TEST_PREFIX}${label}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    fullName: `Message Route ${label}`,
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

describe("Message Route Integration", () => {
  afterAll(async () => {
    const users = await UserModel.find({
      $or: [
        { email: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
        { username: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
      ],
    }).select("_id");

    const ids = users.map((u) => u._id);
    if (ids.length > 0) {
      await MessageModel.deleteMany({
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

  it("protects message routes without auth", async () => {
    expect((await request(app).post("/api/messages").send({})).status).toBe(401);
    expect((await request(app).post("/api/messages/reply").send({})).status).toBe(401);
    expect((await request(app).get("/api/messages/tutor")).status).toBe(401);
    expect((await request(app).get("/api/messages/student")).status).toBe(401);
  });

  it("supports send/reply/get/delete conversation route flow", async () => {
    const student = await createUserAndLogin("user");
    const tutor = await createUserAndLogin("tutor");

    const sendRes = await request(app)
      .post("/api/messages")
      .set("Authorization", `Bearer ${student.token}`)
      .send({ tutorId: tutor.userId, content: "Hi tutor" });

    expect(sendRes.status).toBe(201);
    const messageId = String(sendRes.body.data?._id || "");

    const replyRes = await request(app)
      .post("/api/messages/reply")
      .set("Authorization", `Bearer ${tutor.token}`)
      .send({ studentId: student.userId, content: "Hi student" });

    expect(replyRes.status).toBe(201);

    const tutorInbox = await request(app)
      .get("/api/messages/tutor")
      .set("Authorization", `Bearer ${tutor.token}`);
    expect(tutorInbox.status).toBe(200);

    const studentInbox = await request(app)
      .get("/api/messages/student")
      .set("Authorization", `Bearer ${student.token}`);
    expect(studentInbox.status).toBe(200);

    const deleteMessage = await request(app)
      .delete(`/api/messages/${messageId}`)
      .set("Authorization", `Bearer ${student.token}`);
    expect(deleteMessage.status).toBe(200);

    const deleteConversation = await request(app)
      .delete(`/api/messages/conversation/${tutor.userId}`)
      .set("Authorization", `Bearer ${student.token}`);
    expect(deleteConversation.status).toBe(200);
  });
});