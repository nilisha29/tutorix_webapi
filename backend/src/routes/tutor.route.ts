import { Router } from "express";
import { TutorController } from "../controllers/tutor.controller";
import tutorReviewRoutes from "./tutor-review.route";

const router = Router();
const tutorController = new TutorController();

router.get("/:id", tutorController.getTutorById);
router.use("/:id/reviews", tutorReviewRoutes);

export default router;
