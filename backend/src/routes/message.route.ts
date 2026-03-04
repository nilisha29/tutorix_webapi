import { Router } from "express";
import { authorizedMiddleware } from "../middlewares/authorization.middleware";
import { MessageController } from "../controllers/message.controller";

const router = Router();
const messageController = new MessageController();

router.post("/", authorizedMiddleware, messageController.sendMessage);
router.post("/reply", authorizedMiddleware, messageController.replyToStudent);
router.get("/tutor", authorizedMiddleware, messageController.getTutorMessages);
router.get("/student", authorizedMiddleware, messageController.getStudentMessages);
router.delete("/conversation/:partnerId", authorizedMiddleware, messageController.deleteConversation);
router.delete("/:messageId", authorizedMiddleware, messageController.deleteMessage);

export default router;
