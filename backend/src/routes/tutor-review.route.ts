import { Router } from "express";
import { authorizedMiddleware } from "../middlewares/authorization.middleware";
import { ReviewController } from "../controllers/review.controller";

const router = Router({ mergeParams: true });
const reviewController = new ReviewController();

router.post("/", authorizedMiddleware, reviewController.addTutorReview);

export default router;
