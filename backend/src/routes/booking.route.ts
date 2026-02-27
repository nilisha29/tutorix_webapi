import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { adminOnlyMiddleware, authorizedMiddleware } from "../middlewares/authorization.middleware";

const router = Router();
const bookingController = new BookingController();


router.post("/", authorizedMiddleware, bookingController.createBooking);
router.post("/payments/initiate", authorizedMiddleware, bookingController.initiatePayment);
router.post("/payments/verify", authorizedMiddleware, bookingController.verifyPayment);
router.get("/my-student", authorizedMiddleware, bookingController.getMyStudentBookings);
router.get("/my-tutor", authorizedMiddleware, bookingController.getMyTutorBookings);
router.get("/admin", authorizedMiddleware, adminOnlyMiddleware, bookingController.getAllBookings);

export default router;
