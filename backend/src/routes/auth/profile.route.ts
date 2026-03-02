import { Router } from "express";
import { AuthController } from "../../controllers/auth.controller";
import { authorizedMiddleware } from "../../middlewares/authorization.middleware";
import { uploads } from "../../middlewares/upload.middleware";

const router = Router();
const authController = new AuthController();

router.put(
  "/update-profile",
  authorizedMiddleware,
  uploads.single("profileImage"),
  authController.updateProfile
);

router.get("/whoami", authorizedMiddleware, authController.getProfile);

export default router;
