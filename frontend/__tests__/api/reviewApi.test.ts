import { createTutorReview } from "@/lib/api/review";
import { API } from "@/lib/api/endpoints";
import axios from "@/lib/api/axios";

jest.mock("@/lib/api/axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

describe("review api helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createTutorReview posts review payload to tutor review endpoint", async () => {
    const payload = { quote: "Great tutor", rating: 5 };
    const responseData = { success: true };
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: responseData });

    const result = await createTutorReview("t1", payload);

    expect(axios.post).toHaveBeenCalledWith(`${API.TUTORS.BASE}/t1/reviews`, payload);
    expect(result).toEqual(responseData);
  });
});
