import { Router } from "express";
import { adminOnlyMiddleware, authorizedMiddleware } from "../../middlewares/authorization.middleware";
import { AdminReviewController } from "../../controllers/admin/review.controller";

const router = Router();
const adminReviewController = new AdminReviewController();

router.use(authorizedMiddleware);
router.use(adminOnlyMiddleware);

router.get("/", adminReviewController.getAllTutorReviews.bind(adminReviewController));
router.put("/:id/reviews/:reviewerId", adminReviewController.updateTutorReview.bind(adminReviewController));
router.delete("/:id/reviews/:reviewerId", adminReviewController.deleteTutorReview.bind(adminReviewController));

export default router;
