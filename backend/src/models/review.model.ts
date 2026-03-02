import { Schema } from "mongoose";

export interface IReview {
  reviewerId?: string;
  name: string;
  detail: string;
  profileImage?: string;
  quote: string;
  rating?: number;
}

export const ReviewSchema = new Schema<IReview>(
  {
    reviewerId: { type: String, required: false },
    name: { type: String, required: true },
    detail: { type: String, required: true },
    profileImage: { type: String, required: false },
    quote: { type: String, required: true },
    rating: { type: Number, required: false, min: 1, max: 5 },
  },
  { _id: false }
);
