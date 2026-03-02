import { UserModel } from "../models/user.model";

export class ReviewRepository {
  async addTutorReview(
    tutorId: string,
    reviewData: {
      reviewerId: string;
      name: string;
      detail: string;
      profileImage?: string;
      quote: string;
      rating: number;
    }
  ) {
    const tutor = await UserModel.findOne({ _id: tutorId, role: "tutor" });
    if (!tutor) {
      return null;
    }

    const reviews: any[] = Array.isArray(tutor.reviews) ? [...tutor.reviews] : [];
    const existingIndex = reviews.findIndex(
      (review) => String(review?.reviewerId || "") === reviewData.reviewerId
    );

    const nextReview = {
      reviewerId: reviewData.reviewerId,
      name: reviewData.name,
      detail: reviewData.detail,
      profileImage: reviewData.profileImage,
      quote: reviewData.quote,
      rating: reviewData.rating,
    };

    if (existingIndex >= 0) {
      reviews[existingIndex] = nextReview;
    } else {
      reviews.push(nextReview);
    }

    const ratings = reviews
      .map((review) => Number(review?.rating || 0))
      .filter((rating) => rating > 0);

    const averageRating = ratings.length
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : tutor.rating || 0;

    tutor.reviews = reviews as any;
    tutor.reviewsCount = reviews.length;
    tutor.rating = Number(averageRating.toFixed(1));

    await tutor.save();
    return await UserModel.findOne({ _id: tutorId, role: "tutor" }).select("-password").exec();
  }
}
