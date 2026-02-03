import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authorizedMiddleware, adminOnlyMiddleware } from "../middlewares/authorization.middleware";
import { uploads } from "../middlewares/upload.middleware";
import { AdminUserController } from "../controllers/admin/user.controller";

let authController = new AuthController();
let adminUserController = new AdminUserController();
const router = Router();

// router.post("/register", authController.register)
router.post("/login", authController.login)
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
    "/update-profile",
    authorizedMiddleware,
    uploads.single("profileImage"), // "profileImage" - field name from frontend/client
    authController.updateProfile
)

router.put(
  "/:id",
  authorizedMiddleware,
  uploads.single("profileImage"),
  authController.updateUserById
);


router.get("/whoami", authorizedMiddleware, authController.getProfile);

export default router;