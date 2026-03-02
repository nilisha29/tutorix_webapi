import { Request, Response } from "express";
import { z } from "zod";
import { BecomeTutorDTO } from "../dtos/user.dto";
import { TutorService } from "../services/tutor.service";

const tutorService = new TutorService();

export class TutorController {
  async getTutors(req: Request, res: Response) {
    try {
      const tutors = await tutorService.getTutors();
      return res.status(200).json({
        success: true,
        message: "Tutors retrieved successfully",
        data: tutors,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getTutorById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tutor = await tutorService.getTutorById(id);
      return res.status(200).json({
        success: true,
        message: "Tutor retrieved successfully",
        data: tutor,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async becomeTutor(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID not found",
        });
      }

      const parsedData = BecomeTutorDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const updatedUser = await tutorService.becomeTutor(String(userId), parsedData.data);
      return res.status(200).json({
        success: true,
        message: "Successfully became a tutor",
        data: updatedUser,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

}
