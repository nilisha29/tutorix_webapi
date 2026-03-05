import {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  whoAmI,
} from "@/lib/api/auth";
import { API } from "@/lib/api/endpoints";
import axios from "@/lib/api/axios";

jest.mock("@/lib/api/axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    put: jest.fn(),
    get: jest.fn(),
  },
}));

describe("auth api helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("registerUser posts to register endpoint and returns response data", async () => {
    const payload = { fullName: "User", email: "user@test.com", password: "Password123" };
    const responseData = { success: true, data: { id: "1" } };
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: responseData });

    const result = await registerUser(payload);

    expect(axios.post).toHaveBeenCalledWith(API.AUTH.REGISTER, payload);
    expect(result).toEqual(responseData);
  });

  it("loginUser throws backend error message when request fails", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    await expect(loginUser({ email: "x@test.com", password: "bad" })).rejects.toThrow(
      "Invalid credentials"
    );
  });

  it("forgotPassword posts email to forgot-password endpoint", async () => {
    const responseData = { success: true, message: "Reset link sent" };
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: responseData });

    const result = await forgotPassword("user@test.com");

    expect(axios.post).toHaveBeenCalledWith(API.AUTH.FORGOT_PASSWORD, {
      email: "user@test.com",
    });
    expect(result).toEqual(responseData);
  });

  it("resetPassword posts token and password", async () => {
    const payload = { token: "tkn123", password: "Password123" };
    const responseData = { success: true, message: "Password reset successful" };
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: responseData });

    const result = await resetPassword(payload);

    expect(axios.post).toHaveBeenCalledWith(API.AUTH.RESET_PASSWORD, payload);
    expect(result).toEqual(responseData);
  });

  it("whoAmI gets profile data", async () => {
    const responseData = { success: true, data: { email: "admin@test.com" } };
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: responseData });

    const result = await whoAmI();

    expect(axios.get).toHaveBeenCalledWith(API.AUTH.WHOAMI);
    expect(result).toEqual(responseData);
  });
});
