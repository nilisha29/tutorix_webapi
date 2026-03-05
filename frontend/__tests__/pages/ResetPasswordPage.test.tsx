import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPasswordPage from "@/app/(auth)/reset-password/page";
import { resetPassword } from "@/lib/api/auth";

const replaceMock = jest.fn();
const getMock = jest.fn();

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: any; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
  useSearchParams: () => ({
    get: getMock,
  }),
}));

jest.mock("@/lib/api/auth", () => ({
  resetPassword: jest.fn(),
}));

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getMock.mockReturnValue("test-token");
    document.cookie = "auth_token=old_token";
    document.cookie = "user_data=old_user";
  });

  it("shows an error when reset token is missing", async () => {
    const user = userEvent.setup();
    getMock.mockReturnValue("");

    render(<ResetPasswordPage />);

    await user.type(screen.getByPlaceholderText(/new password/i), "Password123");
    await user.type(screen.getByPlaceholderText(/confirm password/i), "Password123");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    expect(await screen.findByText(/invalid reset link/i)).toBeInTheDocument();
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it("resets password and redirects to login", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    (resetPassword as jest.Mock).mockResolvedValueOnce({
      success: true,
      message: "Password reset successful",
    });

    render(<ResetPasswordPage />);

    await user.type(screen.getByPlaceholderText(/new password/i), "Password123");
    await user.type(screen.getByPlaceholderText(/confirm password/i), "Password123");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith({
        token: "test-token",
        password: "Password123",
      });
    });

    expect(await screen.findByText(/password reset successful/i)).toBeInTheDocument();

    jest.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/login");
    });

    jest.useRealTimers();
  });
});
