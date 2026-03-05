import { Router } from "express";
import { adminOnlyMiddleware, authorizedMiddleware } from "../../middlewares/authorization.middleware";
import { uploads } from "../../middlewares/upload.middleware";
import { AdminTutorController } from "../../controllers/admin/tutor.controller";

const router = Router();
const adminTutorController = new AdminTutorController();

router.use(authorizedMiddleware);
router.use(adminOnlyMiddleware);

router.post("/", uploads.single("profileImage"), adminTutorController.createTutor.bind(adminTutorController));
router.get("/", adminTutorController.getAllTutors.bind(adminTutorController));
router.get("/:id", adminTutorController.getTutorById.bind(adminTutorController));
router.put("/:id", uploads.single("profileImage"), adminTutorController.updateTutor.bind(adminTutorController));
router.delete("/:id", adminTutorController.deleteTutor.bind(adminTutorController));

export default router;
