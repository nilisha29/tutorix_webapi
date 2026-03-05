import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "@/app/(auth)/_components/RegisterForm";
import { handleRegister } from "@/lib/actions/auth-action";

const pushMock = jest.fn();

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

jest.mock("lucide-react", () => ({
  Eye: () => <svg data-testid="eye-icon" />,
  EyeOff: () => <svg data-testid="eyeoff-icon" />,
}));

jest.mock("@/lib/actions/auth-action", () => ({
  handleRegister: jest.fn(),
}));

describe("RegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows password mismatch validation", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByPlaceholderText(/full name/i), "John Doe");
    await user.type(screen.getByPlaceholderText(/email/i), "john@test.com");
    await user.type(screen.getByPlaceholderText(/^password$/i), "Password123");
    await user.type(screen.getByPlaceholderText(/confirm password/i), "Password999");
    await user.type(screen.getByPlaceholderText(/phone number/i), "9812345678");
    await user.type(screen.getByPlaceholderText(/address/i), "Kathmandu");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("submits valid data and routes to login", async () => {
    const user = userEvent.setup();
    (handleRegister as jest.Mock).mockResolvedValueOnce({ success: true });

    render(<RegisterForm />);

    await user.type(screen.getByPlaceholderText(/full name/i), "John Doe");
    await user.type(screen.getByPlaceholderText(/email/i), "john@test.com");
    await user.type(screen.getByPlaceholderText(/^password$/i), "Password123");
    await user.type(screen.getByPlaceholderText(/confirm password/i), "Password123");
    await user.type(screen.getByPlaceholderText(/phone number/i), "9812345678");
    await user.type(screen.getByPlaceholderText(/address/i), "Kathmandu");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(handleRegister).toHaveBeenCalledWith({
        fullName: "John Doe",
        email: "john@test.com",
        username: "john",
        password: "Password123",
        confirmPassword: "Password123",
        phoneNumber: "9812345678",
        address: "Kathmandu",
        profileImage: "",
      });
      expect(pushMock).toHaveBeenCalledWith("/login");
    });
  });
});
