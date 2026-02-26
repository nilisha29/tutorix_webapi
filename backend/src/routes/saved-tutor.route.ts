import { Router } from "express";
import { authorizedMiddleware } from "../middlewares/authorization.middleware";
import { SavedTutorController } from "../controllers/saved-tutor.controller";

const router = Router();
const savedTutorController = new SavedTutorController();

router.post("/", authorizedMiddleware, savedTutorController.saveTutor);
router.get("/my", authorizedMiddleware, savedTutorController.getSavedTutors);
router.delete("/:tutorId", authorizedMiddleware, savedTutorController.removeSavedTutor);

export default router;
