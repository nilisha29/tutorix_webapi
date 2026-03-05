import { Router } from "express";
import { adminOnlyMiddleware, authorizedMiddleware } from "../../middlewares/authorization.middleware";
import { AdminBookingController } from "../../controllers/admin/booking.controller";

const router = Router();
const adminBookingController = new AdminBookingController();

router.use(authorizedMiddleware);
router.use(adminOnlyMiddleware);

router.get("/", adminBookingController.getAllBookings.bind(adminBookingController));
router.get("/:id", adminBookingController.getBookingById.bind(adminBookingController));
router.put("/:id", adminBookingController.updateBooking.bind(adminBookingController));
router.delete("/:id", adminBookingController.deleteBooking.bind(adminBookingController));

export default router;
