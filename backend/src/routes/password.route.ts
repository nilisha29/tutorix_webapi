import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authorizedMiddleware } from "../middlewares/authorization.middleware";

const router = Router();
const authController = new AuthController();

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.put("/change-password", authorizedMiddleware, authController.changePassword);

export default router;
