import { Request, Response } from "express";
import { MessageService } from "../services/message.service";

const messageService = new MessageService();


export class MessageController {
  async sendMessage(req: Request, res: Response) {
    try {
      const studentId = req.user?._id;
      if (!studentId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = await messageService.sendMessage(
        String(studentId),
        String(req.body.tutorId || ""),
        String(req.body.content || "")
      );

      return res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getTutorMessages(req: Request, res: Response) {
    try {
      const tutorId = req.user?._id;
      if (!tutorId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = await messageService.getTutorMessages(String(tutorId));
      return res.status(200).json({
        success: true,
        message: "Tutor messages fetched",
        data,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async deleteTutorMessage(req: Request, res: Response) {
    try {
      const tutorId = req.user?._id;
      if (!tutorId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = await messageService.deleteTutorMessage(
        String(tutorId),
        String(req.params.messageId || "")
      );

      return res.status(200).json({
        success: true,
        message: "Message deleted successfully",
        data,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
