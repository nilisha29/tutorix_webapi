import { Request, Response } from "express";
import z from "zod";
import { CreateUserDTO, UpdateUserDto } from "../../dtos/user.dto";
import { AdminTutorService } from "../../services/admin/tutor.service";

const adminTutorService = new AdminTutorService();

export class AdminTutorController {
  async createTutor(req: Request, res: Response) {
    try {
      const parsedData = CreateUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ success: false, message: z.prettifyError(parsedData.error) });
      }

      if (req.file) {
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        parsedData.data.profileImage = `${baseUrl}/uploads/${req.file.filename}`;
      }

      parsedData.data.role = "tutor";
      const data = await adminTutorService.createTutor(parsedData.data);
      return res.status(201).json({ success: true, message: "Tutor created", data });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async getAllTutors(req: Request, res: Response) {
    try {
      const data = await adminTutorService.getAllTutors();
      return res.status(200).json({ success: true, message: "Tutors retrieved", data });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async getTutorById(req: Request, res: Response) {
    try {
      const data = await adminTutorService.getTutorById(req.params.id);
      return res.status(200).json({ success: true, message: "Tutor retrieved", data });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async updateTutor(req: Request, res: Response) {
    try {
      const parsedData = UpdateUserDto.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ success: false, message: z.prettifyError(parsedData.error) });
      }

      if (req.file) {
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        parsedData.data.profileImage = `${baseUrl}/uploads/${req.file.filename}`;
      }

      const data = await adminTutorService.updateTutor(req.params.id, parsedData.data);
      return res.status(200).json({ success: true, message: "Tutor updated", data });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async deleteTutor(req: Request, res: Response) {
    try {
      const deleted = await adminTutorService.deleteTutor(req.params.id);
      return res.status(200).json({ success: true, message: deleted ? "Tutor deleted" : "Tutor not deleted" });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }
}
