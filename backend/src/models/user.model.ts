import mongoose, { Document, Schema } from "mongoose";
import { UserType } from "../types/user.type";


const UserSchema: Schema = new Schema<UserType>(
  {
      fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
      username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
      phoneNumber: {
      type: String,
      required: false, // optional
    },
    address: {
      type: String,
      required: false, // optional
    },
    profileImage: {
      type: String,
      required: false, // only used in Flutter
    },
    subject: {
      type: String,
      required: false,
      trim: true,
    },
    gradeLevel: {
      type: String,
      required: false,
      trim: true,
    },
    pricePerHour: {
      type: Number,
      required: false,
      min: 0,
    },
    rating: {
      type: Number,
      required: false,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      required: false,
      min: 0,
    },
    about: {
      type: String,
      required: false,
      trim: true,
    },
    experienceYears: {
      type: Number,
      required: false,
      min: 0,
    },
    responseTime: {
      type: String,
      required: false,
      trim: true,
    },
    languages: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    education: {
      type: [String],
      default: [],
    },
    availabilitySlots: {
      type: [
        {
          day: { type: String, required: true },
          times: { type: [String], default: [] },
        },
      ],
      default: [],
    },
    reviews: {
      type: [
        {
          reviewerId: { type: String, required: false },
          name: { type: String, required: true },
          detail: { type: String, required: true },
          profileImage: { type: String, required: false },
          quote: { type: String, required: true },
          rating: { type: Number, required: false, min: 1, max: 5 },
        },
      ],
      default: [],
    },
    // username: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   trim: true,
    // },
    // firstName: { type: String },
    // lastName: { type: String },
    role: {
      type: String,
      enum: ["user", "admin", "tutor"],
      default: "user",
    },
    resetPasswordToken: {
      type: String,
      required: false,
      index: true,
    },
    resetPasswordExpiresAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export interface IUser extends UserType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const UserModel = mongoose.model<IUser>("User", UserSchema);
