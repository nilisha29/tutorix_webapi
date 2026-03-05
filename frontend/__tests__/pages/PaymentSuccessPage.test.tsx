import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaymentSuccessPage from "@/app/(public)/payment-success/page";
import { verifyBookingPayment } from "@/lib/api/booking";

const pushMock = jest.fn();
const getParamMock = jest.fn();

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
  useSearchParams: () => ({
    get: getParamMock,
  }),
}));

jest.mock("@/lib/api/booking", () => ({
  verifyBookingPayment: jest.fn(),
}));

describe("PaymentSuccessPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getParamMock.mockImplementation((key: string) => {
      const params: Record<string, string> = {
        bookingId: "booking-1",
        provider: "esewa",
        status: "success",
        paymentRef: "ref-1",
      };
      return params[key] ?? null;
    });
  });

  it("verifies payment and shows success state", async () => {
    (verifyBookingPayment as jest.Mock).mockResolvedValueOnce({
      data: {
        verified: true,
        payment: { status: "paid", gatewayTxnId: "txn-1" },
      },
    });

    render(<PaymentSuccessPage />);

    await waitFor(() => {
      expect(verifyBookingPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          bookingId: "booking-1",
          provider: "esewa",
          paymentRef: "ref-1",
          status: "success",
        })
      );
    });

    expect(await screen.findByText(/payment confirmed successfully/i)).toBeInTheDocument();
    expect(screen.getByText(/txn-1/i)).toBeInTheDocument();
  });

  it("navigates back to tutors on button click", async () => {
    const user = userEvent.setup();
    (verifyBookingPayment as jest.Mock).mockResolvedValueOnce({
      data: {
        verified: true,
        payment: { status: "paid" },
      },
    });

    render(<PaymentSuccessPage />);

    await user.click(screen.getByRole("button", { name: /back to tutors/i }));

    expect(pushMock).toHaveBeenCalledWith("/tutors");
  });
});
