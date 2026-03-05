import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/app/(auth)/_components/LoginForm";
import { handleLogin } from "@/lib/actions/auth-action";

const pushMock = jest.fn();
const checkAuthMock = jest.fn();

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: any; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    checkAuth: checkAuthMock,
  }),
}));

jest.mock("@/lib/actions/auth-action", () => ({
  handleLogin: jest.fn(),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows validation messages for invalid input", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /sign-in/i }));

    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it("logs in and routes admin user to admin dashboard", async () => {
    const user = userEvent.setup();
    (handleLogin as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: { user: { role: "admin" } },
    });

    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText(/e-mail/i), "admin@test.com");
    await user.type(screen.getByPlaceholderText(/password/i), "Password123");
    await user.click(screen.getByRole("button", { name: /sign-in/i }));

    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith({
        email: "admin@test.com",
        password: "Password123",
      });
      expect(checkAuthMock).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith("/admin");
    });
  });
});
