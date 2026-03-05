import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authorizedMiddleware, adminOnlyMiddleware } from "../middlewares/authorization.middleware";
import { uploads } from "../middlewares/upload.middleware";
import { AdminUserController } from "../controllers/admin/user.controller";
import passwordRoutes from "./password.route";
import authTutorRoutes from "./auth-tutor.route";
import authProfileRoutes from "./profile.route";

let authController = new AuthController();
let adminUserController = new AdminUserController();
const router = Router();

// router.post("/register", authController.register)
router.post("/login", authController.login)
router.use(passwordRoutes)
router.use(authTutorRoutes)
router.use(authProfileRoutes)
// add remaning routes like login, logout, etc.

router.post(
  "/register",
  uploads.single("profileImage"),
  authController.register
);

router.post(
  "/user",
  authorizedMiddleware,
  adminOnlyMiddleware,
  uploads.single("profileImage"),
  adminUserController.createUser
);

router.put(
  "/:id",
  authorizedMiddleware,
  uploads.single("profileImage"),
  authController.updateUserById
);

export default router;