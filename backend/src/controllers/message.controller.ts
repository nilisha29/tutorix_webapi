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

  async getStudentMessages(req: Request, res: Response) {
    try {
      const studentId = req.user?._id;
      if (!studentId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = await messageService.getStudentMessages(String(studentId));
      return res.status(200).json({
        success: true,
        message: "Student messages fetched",
        data,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async replyToStudent(req: Request, res: Response) {
    try {
      const tutorId = req.user?._id;
      if (!tutorId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = await messageService.replyToStudent(
        String(tutorId),
        String(req.body.studentId || ""),
        String(req.body.content || "")
      );

      return res.status(201).json({
        success: true,
        message: "Reply sent successfully",
        data,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async deleteMessage(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = await messageService.deleteMessageForUser(
        String(userId),
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

  async deleteConversation(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = await messageService.deleteConversationForUser(
        String(userId),
        String(req.params.partnerId || "")
      );

      return res.status(200).json({
        success: true,
        message: "Conversation deleted successfully",
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
