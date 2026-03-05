import { getAdminPayments } from "@/lib/api/admin/payment";
import { API } from "@/lib/api/endpoints";
import axios from "@/lib/api/axios";

jest.mock("@/lib/api/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));


describe("admin payment api helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getAdminPayments fetches admin payment list", async () => {
    const responseData = { success: true, data: [] };
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: responseData });

    const result = await getAdminPayments();

    expect(axios.get).toHaveBeenCalledWith(API.ADMIN.PAYMENTS.LIST);
    expect(result).toEqual(responseData);
  });
});
