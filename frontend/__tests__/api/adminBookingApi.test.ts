import { getAdminBookings } from "@/lib/api/admin/booking";
import { API } from "@/lib/api/endpoints";
import axios from "@/lib/api/axios";

jest.mock("@/lib/api/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("admin booking api helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getAdminBookings fetches admin booking list", async () => {
    const responseData = { success: true, data: [] };
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: responseData });

    const result = await getAdminBookings();

    expect(axios.get).toHaveBeenCalledWith(API.ADMIN.BOOKINGS.LIST);
    expect(result).toEqual(responseData);
  });
});
