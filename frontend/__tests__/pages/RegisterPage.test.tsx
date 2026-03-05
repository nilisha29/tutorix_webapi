import { render, screen } from "@testing-library/react";
import RegisterPage from "@/app/(auth)/register/page";

jest.mock("@/app/(auth)/_components/RegisterForm", () => ({
  __esModule: true,
  default: () => <div data-testid="register-form-mock">Register Form Mock</div>,
}));

describe("RegisterPage", () => {
  it("renders register heading and form", () => {
    render(<RegisterPage />);

    expect(
      screen.getByRole("heading", { name: /create your tutorix account/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId("register-form-mock")).toBeInTheDocument();
    expect(screen.getByAltText(/tutorix register/i)).toBeInTheDocument();
  });
});
