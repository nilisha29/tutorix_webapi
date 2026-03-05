import { HttpError } from "../../errors/http-error";
import { UserRepository } from "../../repositories/user.repository";

const userRepository = new UserRepository();

export class AdminReviewService {
  async getAllTutorReviews() {
    const tutors = await userRepository.getUsersByRole("tutor", false);
    return (tutors || []).filter((tutor: any) => Array.isArray(tutor.reviews) && tutor.reviews.length > 0);
  }

  async updateTutorReview(tutorId: string, reviewerId: string, payload: { quote?: string; rating?: number }) {
    const tutor = await userRepository.getTutorById(tutorId, false);
    if (!tutor) {
      throw new HttpError(404, "Tutor not found");
    }

    const updated = await userRepository.updateTutorReviewByReviewerId(tutorId, reviewerId, payload);
    if (!updated) {
      throw new HttpError(404, "Review not found");
    }

    return updated;
  }

  async deleteTutorReview(tutorId: string, reviewerId: string) {
    const tutor = await userRepository.getTutorById(tutorId, false);
    if (!tutor) {
      throw new HttpError(404, "Tutor not found");
    }

    const updated = await userRepository.deleteTutorReviewByReviewerId(tutorId, reviewerId);
    if (!updated) {
      throw new HttpError(404, "Review not found");
    }

    return updated;
  }
}
