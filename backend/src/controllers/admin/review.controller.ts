import { Request, Response } from "express";
import { AdminReviewService } from "../../services/admin/review.service";

const adminReviewService = new AdminReviewService();

export class AdminReviewController {
  async getAllTutorReviews(req: Request, res: Response) {
    try {
      const data = await adminReviewService.getAllTutorReviews();
      return res.status(200).json({ success: true, message: "All tutor reviews retrieved", data });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async updateTutorReview(req: Request, res: Response) {
    try {
      const { id, reviewerId } = req.params;
      const data = await adminReviewService.updateTutorReview(id, reviewerId, {
        quote: typeof req.body.quote === "string" ? req.body.quote : undefined,
        rating: req.body.rating !== undefined ? Number(req.body.rating) : undefined,
      });
      return res.status(200).json({ success: true, message: "Review updated", data });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async deleteTutorReview(req: Request, res: Response) {
    try {
      const { id, reviewerId } = req.params;
      const data = await adminReviewService.deleteTutorReview(id, reviewerId);
      return res.status(200).json({ success: true, message: "Review deleted", data });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }
}
