import { saveTutor, getMySavedTutors, removeSavedTutor } from "@/lib/api/saved-tutor";
import { API } from "@/lib/api/endpoints";
import axios from "@/lib/api/axios";

jest.mock("@/lib/api/axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("saved tutor api helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("saveTutor posts tutor id", async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    await saveTutor("t1");

    expect(axios.post).toHaveBeenCalledWith(API.SAVED_TUTORS.BASE, { tutorId: "t1" });
  });

  it("getMySavedTutors gets saved tutors", async () => {
    const responseData = { success: true, data: [] };
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: responseData });

    const result = await getMySavedTutors();

    expect(axios.get).toHaveBeenCalledWith(API.SAVED_TUTORS.MY);
    expect(result).toEqual(responseData);
  });

  it("removeSavedTutor deletes by tutor id", async () => {
    (axios.delete as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    await removeSavedTutor("t1");

    expect(axios.delete).toHaveBeenCalledWith(`${API.SAVED_TUTORS.BASE}/t1`);
  });
});
