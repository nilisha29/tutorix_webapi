import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authorizedMiddleware } from "../middlewares/authorization.middleware";

const router = Router();
const authController = new AuthController();

router.get("/:id", authController.getTutorById);
router.post("/:id/reviews", authorizedMiddleware, authController.addTutorReview);

export default router;
