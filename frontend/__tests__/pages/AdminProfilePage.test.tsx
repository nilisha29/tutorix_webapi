import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminProfilePage from "@/app/admin/profile/page";
import { handleUpdateProfile } from "@/lib/actions/auth-action";

const setUserMock = jest.fn();
const useAuthMock = jest.fn();

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => useAuthMock(),
}));

jest.mock("@/lib/actions/auth-action", () => ({
  handleUpdateProfile: jest.fn(),
}));

describe("AdminProfilePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state when user is not available", () => {
    useAuthMock.mockReturnValue({ user: null, setUser: setUserMock });

    render(<AdminProfilePage />);

    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
  });

  it("edits and saves profile details", async () => {
    const user = userEvent.setup();
    useAuthMock.mockReturnValue({
      user: {
        fullName: "Admin User",
        username: "admin",
        email: "admin@test.com",
        phoneNumber: "9800000000",
        address: "Kathmandu",
      },
      setUser: setUserMock,
    });

    (handleUpdateProfile as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: {
        fullName: "Updated Admin",
        username: "admin",
        email: "admin@test.com",
        phoneNumber: "9800000000",
        address: "Kathmandu",
      },
    });

    render(<AdminProfilePage />);

    await user.click(screen.getByRole("button", { name: /edit profile/i }));

    const fullNameInput = screen.getByDisplayValue("Admin User");
    await user.clear(fullNameInput);
    await user.type(fullNameInput, "Updated Admin");

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(handleUpdateProfile).toHaveBeenCalledTimes(1);
    });

    const formData = (handleUpdateProfile as jest.Mock).mock.calls[0][0] as FormData;
    expect(formData.get("fullName")).toBe("Updated Admin");
    expect(formData.get("email")).toBe("admin@test.com");

    expect(setUserMock).toHaveBeenCalledWith(
      expect.objectContaining({ fullName: "Updated Admin" })
    );
    expect(await screen.findByText(/profile updated successfully/i)).toBeInTheDocument();
  });
});
