import mongoose, { Document, Schema } from "mongoose";

export interface ISavedTutor extends Document {
  studentId: mongoose.Types.ObjectId;
  tutorId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SavedTutorSchema = new Schema<ISavedTutor>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tutorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

SavedTutorSchema.index({ studentId: 1, tutorId: 1 }, { unique: true });

export const SavedTutorModel = mongoose.model<ISavedTutor>("SavedTutor", SavedTutorSchema);
