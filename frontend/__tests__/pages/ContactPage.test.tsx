import { render, screen } from "@testing-library/react";
import ContactPage from "@/app/(public)/contact/page";

describe("ContactPage", () => {
  it("renders contact details", () => {
    render(<ContactPage />);

    expect(screen.getByRole("heading", { name: /contact/i })).toBeInTheDocument();
    expect(screen.getByText(/support@tutorix.com/i)).toBeInTheDocument();
    expect(screen.getByText(/\+1 \(555\) 204-8899/i)).toBeInTheDocument();
  });
});
