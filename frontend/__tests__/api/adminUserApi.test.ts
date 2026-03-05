import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from "@/lib/api/admin/user";
import { API } from "@/lib/api/endpoints";
import axios from "@/lib/api/axios";

jest.mock("@/lib/api/axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("admin user api helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createUser posts multipart payload", async () => {
    const payload = new FormData();
    payload.append("fullName", "User");
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    await createUser(payload);

    expect(axios.post).toHaveBeenCalledWith(API.ADMIN.USER.BASE, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  });

  it("getAllUsers returns data array", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { success: true, data: [{ id: "1" }] },
    });

    const result = await getAllUsers();

    expect(axios.get).toHaveBeenCalledWith(API.ADMIN.USER.BASE);
    expect(result).toEqual([{ id: "1" }]);
  });

  it("getUserById, updateUser and deleteUser use id-based routes", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { data: { id: "u1" } } });
    (axios.put as jest.Mock).mockResolvedValueOnce({ data: { data: { id: "u1" } } });
    (axios.delete as jest.Mock).mockResolvedValueOnce({ data: { data: { id: "u1" } } });

    await getUserById("u1");
    await updateUser("u1", { fullName: "Updated" });
    await deleteUser("u1");

    expect(axios.get).toHaveBeenCalledWith(`${API.ADMIN.USER.BASE}/u1`);
    expect(axios.put).toHaveBeenCalledWith(`${API.ADMIN.USER.BASE}/u1`, { fullName: "Updated" }, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    expect(axios.delete).toHaveBeenCalledWith(`${API.ADMIN.USER.BASE}/u1`);
  });

  it("throws backend message when createUser fails", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: "Create user failed from backend" } },
    });

    await expect(createUser({})).rejects.toThrow("Create user failed from backend");
  });
});
