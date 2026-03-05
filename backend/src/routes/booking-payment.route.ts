import { Router } from "express";
import { authorizedMiddleware } from "../middlewares/authorization.middleware";
import { PaymentController } from "../controllers/payment.controller";

const router = Router();
const paymentController = new PaymentController();

router.post("/initiate", authorizedMiddleware, paymentController.initiatePayment);
router.post("/verify", authorizedMiddleware, paymentController.verifyPayment);

export default router;
