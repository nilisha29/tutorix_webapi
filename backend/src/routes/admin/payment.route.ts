import { Router } from "express";
import { adminOnlyMiddleware, authorizedMiddleware } from "../../middlewares/authorization.middleware";
import { AdminPaymentController } from "../../controllers/admin/payment.controller";

const router = Router();
const adminPaymentController = new AdminPaymentController();

router.use(authorizedMiddleware);
router.use(adminOnlyMiddleware);

router.get("/", adminPaymentController.getAllPayments.bind(adminPaymentController));
router.get("/:id", adminPaymentController.getPaymentById.bind(adminPaymentController));
router.put("/:id", adminPaymentController.updatePayment.bind(adminPaymentController));
router.delete("/:id", adminPaymentController.deletePayment.bind(adminPaymentController));

export default router;
