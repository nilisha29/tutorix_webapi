import { Request, Response } from "express";
import { SavedTutorService } from "../services/saved-tutor.service";

const savedTutorService = new SavedTutorService();

export class SavedTutorController {
  async saveTutor(req: Request, res: Response) {
    try {
      const studentId = req.user?._id;
      if (!studentId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = await savedTutorService.saveTutor(String(studentId), String(req.body.tutorId || ""));
      return res.status(201).json({
        success: true,
        message: "Tutor saved successfully",
        data,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getSavedTutors(req: Request, res: Response) {
    try {
      const studentId = req.user?._id;
      if (!studentId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = await savedTutorService.getSavedTutors(String(studentId));
      return res.status(200).json({
        success: true,
        message: "Saved tutors fetched",
        data,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async removeSavedTutor(req: Request, res: Response) {
    try {
      const studentId = req.user?._id;
      if (!studentId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const removed = await savedTutorService.removeSavedTutor(String(studentId), String(req.params.tutorId || ""));
      return res.status(200).json({
        success: true,
        message: removed ? "Saved tutor removed" : "Saved tutor not found",
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
