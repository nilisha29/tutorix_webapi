import { HttpError } from "../errors/http-error";
import { ReviewRepository } from "../repositories/review.repository";
import { UserRepository } from "../repositories/user.repository";

const reviewRepository = new ReviewRepository();
const userRepository = new UserRepository();

export class ReviewService {
  async addTutorReview(
    tutorId: string,
    reviewerId: string,
    reviewData: { quote: string; rating: number }
  ) {
    const reviewer = await userRepository.getUserById(reviewerId);
    if (!reviewer) {
      throw new HttpError(404, "User not found");
    }

    const savedTutor = await reviewRepository.addTutorReview(tutorId, {
      reviewerId: String(reviewer._id),
      name: reviewer.fullName || reviewer.username || "User",
      detail: `${reviewer.username || reviewer.fullName}`,
      profileImage: reviewer.profileImage,
      quote: reviewData.quote,
      rating: reviewData.rating,
    });

    if (!savedTutor) {
      throw new HttpError(404, "Tutor not found");
    }

    return savedTutor;
  }
}
