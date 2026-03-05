import { SavedTutorService } from "../../services/saved-tutor.service";
import { UserModel } from "../../models/user.model";
import { SavedTutorModel } from "../../models/saved-tutor.model";

const TEST_PREFIX = "savservtest_";
const savedTutorService = new SavedTutorService();

function uniqueBase(label: string) {
  return `${TEST_PREFIX}${label}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function createUser(role: "user" | "tutor" = "user") {
  const base = uniqueBase(role);
  return await UserModel.create({
    fullName: `Saved Tutor Service ${role}`,
    email: `${base}@example.com`,
    username: base,
    password: "password123",
    phoneNumber: "9800000000",
    address: "Kathmandu",
    role,
    ...(role === "tutor" ? { tutorOrigin: "self" } : {}),
  });
}

describe("SavedTutor Service", () => {
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

  it("save/get/remove saved tutor flow works", async () => {
    const student = await createUser("user");
    const tutor = await createUser("tutor");

    const saved = await savedTutorService.saveTutor(String(student._id), String(tutor._id));
    expect(String(saved.studentId)).toBe(String(student._id));
    expect(String(saved.tutorId)).toBe(String(tutor._id));

    const list = await savedTutorService.getSavedTutors(String(student._id));
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThanOrEqual(1);

    const removed = await savedTutorService.removeSavedTutor(String(student._id), String(tutor._id));
    expect(removed).toBe(true);

    const removedAgain = await savedTutorService.removeSavedTutor(String(student._id), String(tutor._id));
    expect(removedAgain).toBe(false);
  });

  it("returns existing saved record if already saved", async () => {
    const student = await createUser("user");
    const tutor = await createUser("tutor");

    const first = await savedTutorService.saveTutor(String(student._id), String(tutor._id));
    const second = await savedTutorService.saveTutor(String(student._id), String(tutor._id));

    expect(String(first._id)).toBe(String(second._id));
  });

  it("throws for invalid ids or non-tutor target", async () => {
    await expect(savedTutorService.saveTutor("bad", "bad")).rejects.toMatchObject({ statusCode: 400 });

    const student = await createUser("user");
    const nonTutor = await createUser("user");

    await expect(
      savedTutorService.saveTutor(String(student._id), String(nonTutor._id))
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Tutor not found",
    });
  });
});