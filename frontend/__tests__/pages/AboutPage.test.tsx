import { render, screen } from "@testing-library/react";
import AboutPage from "@/app/(public)/about/page";

describe("AboutPage", () => {
  it("renders key about content", () => {
    render(<AboutPage />);

    expect(screen.getByRole("heading", { name: /about tutorix/i })).toBeInTheDocument();
    expect(screen.getByText(/search tutors/i)).toBeInTheDocument();
    expect(screen.getByText(/book & pay securely/i)).toBeInTheDocument();
    expect(screen.getByText(/learn & grow/i)).toBeInTheDocument();
  });
});
