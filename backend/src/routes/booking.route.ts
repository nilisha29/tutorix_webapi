import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { adminOnlyMiddleware, authorizedMiddleware } from "../middlewares/authorization.middleware";
import paymentRoutes from "./booking/payment.route";

const router = Router();
const bookingController = new BookingController();


router.post("/", authorizedMiddleware, bookingController.createBooking);
router.use("/payments", paymentRoutes);
router.get("/my-student", authorizedMiddleware, bookingController.getMyStudentBookings);
router.get("/my-tutor", authorizedMiddleware, bookingController.getMyTutorBookings);
router.get("/admin", authorizedMiddleware, adminOnlyMiddleware, bookingController.getAllBookings);

export default router;
