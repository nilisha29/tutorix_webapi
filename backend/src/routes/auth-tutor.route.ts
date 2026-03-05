import { Router } from "express";
import { TutorController } from "../controllers/tutor.controller";
import { authorizedMiddleware } from "../middlewares/authorization.middleware";
import { uploads } from "../middlewares/upload.middleware";

const router = Router();
const tutorController = new TutorController();

router.put(
  "/become-tutor",
  authorizedMiddleware,
  uploads.single("profileImage"),
  tutorController.becomeTutor
);

router.get("/tutors", tutorController.getTutors);

export default router;
