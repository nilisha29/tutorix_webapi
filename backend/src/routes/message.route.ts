import { Router } from "express";
import { authorizedMiddleware } from "../middlewares/authorization.middleware";
import { MessageController } from "../controllers/message.controller";

const router = Router();
const messageController = new MessageController();

router.post("/", authorizedMiddleware, messageController.sendMessage);
router.get("/tutor", authorizedMiddleware, messageController.getTutorMessages);
router.delete("/:messageId", authorizedMiddleware, messageController.deleteTutorMessage);

export default router;
