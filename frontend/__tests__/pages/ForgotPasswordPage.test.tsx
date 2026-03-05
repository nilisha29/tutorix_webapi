import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPasswordPage from "@/app/(auth)/forgot-password/page";
import { forgotPassword } from "@/lib/api/auth";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: any; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("@/lib/api/auth", () => ({
  forgotPassword: jest.fn(),
}));

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows validation error when email is empty", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordPage />);

    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(await screen.findByText(/please enter your email/i)).toBeInTheDocument();
    expect(forgotPassword).not.toHaveBeenCalled();
  });

  it("submits email and shows success message", async () => {
    const user = userEvent.setup();
    (forgotPassword as jest.Mock).mockResolvedValueOnce({
      success: true,
      message: "Reset link sent",
    });

    render(<ForgotPasswordPage />);

    await user.type(screen.getByPlaceholderText(/e-mail/i), "user@test.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(forgotPassword).toHaveBeenCalledWith("user@test.com");
    });

    expect(await screen.findByText(/reset link sent/i)).toBeInTheDocument();
  });
});
