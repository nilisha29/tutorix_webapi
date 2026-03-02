import { Request, Response } from "express";
import { AddTutorReviewDTO } from "../dtos/user.dto";
import { ReviewService } from "../services/review.service";

const reviewService = new ReviewService();

export class ReviewController {
  async addTutorReview(req: Request, res: Response) {
    try {
      const reviewerId = req.user?._id;
      const { id } = req.params;

      if (!reviewerId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const parsedData = AddTutorReviewDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          errors: parsedData.error.flatten(),
        });
      }

      const tutor = await reviewService.addTutorReview(id, String(reviewerId), parsedData.data);
      return res.status(200).json({
        success: true,
        message: "Review submitted successfully",
        data: tutor,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
