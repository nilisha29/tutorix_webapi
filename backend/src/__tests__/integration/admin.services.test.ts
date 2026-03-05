import { AdminUserService } from "../../services/admin/user.service";
import { AdminTutorService } from "../../services/admin/tutor.service";
import { AdminBookingService } from "../../services/admin/booking.service";
import { AdminPaymentService } from "../../services/admin/payment.service";
import { AdminReviewService } from "../../services/admin/review.service";
import { UserModel } from "../../models/user.model";
import { BookingModel } from "../../models/booking.model";

const TEST_PREFIX = "adminservtest_";

const adminUserService = new AdminUserService();
const adminTutorService = new AdminTutorService();
const adminBookingService = new AdminBookingService();
const adminPaymentService = new AdminPaymentService();
const adminReviewService = new AdminReviewService();

function uniqueBase(label: string) {
  return `${TEST_PREFIX}${label}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function createUser(role: "user" | "tutor" = "user") {
  const base = uniqueBase(role);
  return await UserModel.create({
    fullName: `Admin Service ${role}`,
    email: `${base}@example.com`,
    username: base,
    password: "password123",
    phoneNumber: "9800000000",
    address: "Kathmandu",
    role,
    ...(role === "tutor" ? { tutorOrigin: "self" } : {}),
  });
}

describe("Admin Services", () => {
  afterAll(async () => {
    const users = await UserModel.find({
      $or: [
        { email: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
        { username: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
      ],
    }).select("_id");

    const ids = users.map((u) => u._id);
    if (ids.length > 0) {
      await BookingModel.deleteMany({
        $or: [{ studentId: { $in: ids } }, { tutorId: { $in: ids } }],
      });
    }

    await UserModel.deleteMany({
      $or: [
        { email: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
        { username: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
      ],
    });
  });

  it("admin user service can create/update/get/delete user", async () => {
    const base = uniqueBase("managed");

    const created = await adminUserService.createUser({
      fullName: "Managed User",
      email: `${base}@example.com`,
      username: base,
      password: "password123",
      confirmPassword: "password123",
      role: "user",
    } as any);

    expect(created.email).toContain(base);

    const fetched = await adminUserService.getUserById(String(created._id));
    expect(String(fetched._id)).toBe(String(created._id));

    const updated = await adminUserService.updateUser(String(created._id), {
      fullName: "Managed User Updated",
    } as any);

    expect(updated?.fullName).toBe("Managed User Updated");

    const deleted = await adminUserService.deleteUser(String(created._id));
    expect(deleted).toBe(true);
  });

  it("admin tutor service can create/get/update/delete tutor", async () => {
    const base = uniqueBase("tutor");

    const tutor = await adminTutorService.createTutor({
      fullName: "Admin Tutor",
      email: `${base}@example.com`,
      username: base,
      password: "password123",
      confirmPassword: "password123",
      role: "tutor",
    } as any);

    expect(tutor.role).toBe("tutor");

    const fetched = await adminTutorService.getTutorById(String(tutor._id));
    expect(String(fetched._id)).toBe(String(tutor._id));

    const updated = await adminTutorService.updateTutor(String(tutor._id), {
      fullName: "Admin Tutor Updated",
    } as any);

    expect(updated?.fullName).toBe("Admin Tutor Updated");

    const deleted = await adminTutorService.deleteTutor(String(tutor._id));
    expect(deleted).toBe(true);
  });

  it("admin booking/payment services can list/get/update/delete booking record", async () => {
    const student = await createUser("user");
    const tutor = await createUser("tutor");

    const booking = await BookingModel.create({
      studentId: student._id,
      tutorId: tutor._id,
      date: "2026-03-08",
      time: "10:30",
      duration: "60",
      paymentMethod: "khalti",
      amount: 600,
      paymentStatus: "pending",
      bookingStatus: "pending",
    });

    const bookings = await adminBookingService.getAllBookings();
    expect(Array.isArray(bookings)).toBe(true);

    const bookingById = await adminBookingService.getBookingById(String(booking._id));
    expect(String(bookingById._id)).toBe(String(booking._id));

    const bookingUpdated = await adminBookingService.updateBooking(String(booking._id), {
      paymentStatus: "paid",
      bookingStatus: "confirmed",
    });
    expect(bookingUpdated.paymentStatus).toBe("paid");

    const payments = await adminPaymentService.getAllPayments();
    expect(Array.isArray(payments)).toBe(true);

    const paymentById = await adminPaymentService.getPaymentById(String(booking._id));
    expect(String(paymentById._id)).toBe(String(booking._id));

    const paymentUpdated = await adminPaymentService.updatePayment(String(booking._id), {
      amount: 650,
      paymentStatus: "paid",
    });
    expect(paymentUpdated.amount).toBe(650);

    const deletedByPaymentService = await adminPaymentService.deletePayment(String(booking._id));
    expect(deletedByPaymentService).toBe(true);
  });

  it("admin review service can list/update/delete tutor review", async () => {
    const reviewer = await createUser("user");
    const tutor = await createUser("tutor");

    await UserModel.findByIdAndUpdate(String(tutor._id), {
      $set: {
        reviews: [
          {
            reviewerId: String(reviewer._id),
            name: "Reviewer",
            detail: "reviewer-detail",
            quote: "Great tutor",
            rating: 5,
          },
        ],
        reviewsCount: 1,
        rating: 5,
      },
    });

    const list = await adminReviewService.getAllTutorReviews();
    expect(Array.isArray(list)).toBe(true);

    const updated = await adminReviewService.updateTutorReview(
      String(tutor._id),
      String(reviewer._id),
      { quote: "Updated quote", rating: 4 }
    );

    const updatedReview = (updated as any).reviews?.find(
      (r: any) => String(r.reviewerId) === String(reviewer._id)
    );
    expect(updatedReview?.quote).toBe("Updated quote");

    const deleted = await adminReviewService.deleteTutorReview(
      String(tutor._id),
      String(reviewer._id)
    );

    expect(Array.isArray((deleted as any).reviews)).toBe(true);
    expect((deleted as any).reviews.length).toBe(0);
  });
});