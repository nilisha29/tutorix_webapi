import { MessageService } from "../../services/message.service";
import { UserModel } from "../../models/user.model";
import { MessageModel } from "../../models/message.model";

const TEST_PREFIX = "msgservtest_";
const messageService = new MessageService();

function uniqueBase(label: string) {
  return `${TEST_PREFIX}${label}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function createUser(role: "user" | "tutor" = "user") {
  const base = uniqueBase(role);
  return await UserModel.create({
    fullName: `Message Service ${role}`,
    email: `${base}@example.com`,
    username: base,
    password: "password123",
    phoneNumber: "9800000000",
    address: "Kathmandu",
    role,
    ...(role === "tutor" ? { tutorOrigin: "self" } : {}),
  });
}

describe("Message Service", () => {
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

  it("sendMessage and replyToStudent work for valid users", async () => {
    const student = await createUser("user");
    const tutor = await createUser("tutor");

    const msg = await messageService.sendMessage(String(student._id), String(tutor._id), " Hello tutor ");
    expect(msg?.content).toBe("Hello tutor");
    expect(msg?.senderRole).toBe("student");

    const reply = await messageService.replyToStudent(String(tutor._id), String(student._id), " Sure ");
    expect(reply?.content).toBe("Sure");
    expect(reply?.senderRole).toBe("tutor");
  });

  it("throws for invalid ids and empty content", async () => {
    await expect(
      messageService.sendMessage("bad-id", "bad-id", "hi")
    ).rejects.toMatchObject({ statusCode: 400 });

    const student = await createUser("user");
    const tutor = await createUser("tutor");

    await expect(
      messageService.sendMessage(String(student._id), String(tutor._id), "   ")
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Message content is required",
    });
  });

  it("get and delete message operations work", async () => {
    const student = await createUser("user");
    const tutor = await createUser("tutor");

    const created = await messageService.sendMessage(String(student._id), String(tutor._id), "Need help");

    const tutorMessages = await messageService.getTutorMessages(String(tutor._id));
    expect(Array.isArray(tutorMessages)).toBe(true);
    expect(tutorMessages.length).toBeGreaterThanOrEqual(1);

    const studentMessages = await messageService.getStudentMessages(String(student._id));
    expect(Array.isArray(studentMessages)).toBe(true);
    expect(studentMessages.length).toBeGreaterThanOrEqual(1);

    const deleted = await messageService.deleteMessageForUser(String(student._id), String(created?._id));
    expect(String(deleted?._id)).toBe(String(created?._id));

    await expect(
      messageService.deleteMessageForUser(String(student._id), String(created?._id))
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Message not found",
    });
  });

  it("deleteConversationForUser removes both-side conversation", async () => {
    const student = await createUser("user");
    const tutor = await createUser("tutor");

    await messageService.sendMessage(String(student._id), String(tutor._id), "Q1");
    await messageService.replyToStudent(String(tutor._id), String(student._id), "A1");

    const result = await messageService.deleteConversationForUser(String(student._id), String(tutor._id));
    expect(result.deletedCount).toBeGreaterThanOrEqual(2);

    await expect(
      messageService.deleteConversationForUser(String(student._id), String(student._id))
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Invalid conversation partner",
    });
  });
});