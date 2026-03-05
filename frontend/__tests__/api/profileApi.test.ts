import { getMyProfile, updateMyProfile, becomeTutor } from "@/lib/api/profile";
import { API } from "@/lib/api/endpoints";
import axios from "@/lib/api/axios";

jest.mock("@/lib/api/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));

describe("profile api helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getMyProfile fetches whoami endpoint", async () => {
    const responseData = { success: true, data: { id: "u1" } };
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: responseData });

    const result = await getMyProfile();

    expect(axios.get).toHaveBeenCalledWith(API.AUTH.WHOAMI);
    expect(result).toEqual(responseData);
  });

  it("updateMyProfile sends multipart form data", async () => {
    const payload = new FormData();
    payload.append("fullName", "User");
    (axios.put as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    await updateMyProfile(payload);

    expect(axios.put).toHaveBeenCalledWith(API.AUTH.UPDATE_PROFILE, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  });

  it("becomeTutor supports plain object payload", async () => {
    const payload = { about: "Bio", experienceYears: 2 };
    (axios.put as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    await becomeTutor(payload);

    expect(axios.put).toHaveBeenCalledWith(API.AUTH.TUTOR.BECOME, payload, {
      headers: undefined,
    });
  });
});
