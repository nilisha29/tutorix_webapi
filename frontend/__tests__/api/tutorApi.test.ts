import { getTutorList, getTutorDetail } from "@/lib/api/tutor";
import { API } from "@/lib/api/endpoints";
import axios from "@/lib/api/axios";

jest.mock("@/lib/api/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("tutor api helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getTutorList fetches tutor list endpoint", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { success: true, data: [] } });

    await getTutorList();

    expect(axios.get).toHaveBeenCalledWith(API.AUTH.TUTOR.LIST);
  });

  it("getTutorDetail fetches tutor by id", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { success: true, data: {} } });

    await getTutorDetail("t1");

    expect(axios.get).toHaveBeenCalledWith(`${API.TUTORS.BASE}/t1`);
  });
});
