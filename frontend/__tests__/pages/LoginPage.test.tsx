import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/(auth)/login/page";

jest.mock("@/app/(auth)/_components/LoginForm", () => ({
  __esModule: true,
  default: () => <div data-testid="login-form-mock">Login Form Mock</div>,
}));

describe("LoginPage", () => {
  it("renders login heading and form", () => {
    render(<LoginPage />);

    expect(
      screen.getByRole("heading", { name: /sign in to your tutorix account/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId("login-form-mock")).toBeInTheDocument();
    expect(screen.getByAltText(/tutorix login/i)).toBeInTheDocument();
  });
});
