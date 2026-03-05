import { updateAdminTutorReview, deleteAdminTutorReview } from "@/lib/api/admin/review";
import { API } from "@/lib/api/endpoints";
import axios from "@/lib/api/axios";

jest.mock("@/lib/api/axios", () => ({
  __esModule: true,
  default: {
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("admin review api helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updateAdminTutorReview puts payload to reviewer route", async () => {
    const payload = { quote: "Updated", rating: 5 };
    (axios.put as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    await updateAdminTutorReview("t1", "u2", payload);

    expect(axios.put).toHaveBeenCalledWith(
      API.ADMIN.REVIEWS.REVIEW_BY_REVIEWER("t1", "u2"),
      payload
    );
  });

  it("deleteAdminTutorReview deletes reviewer route", async () => {
    (axios.delete as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    await deleteAdminTutorReview("t1", "u2");

    expect(axios.delete).toHaveBeenCalledWith(
      API.ADMIN.REVIEWS.REVIEW_BY_REVIEWER("t1", "u2")
    );
  });
});
