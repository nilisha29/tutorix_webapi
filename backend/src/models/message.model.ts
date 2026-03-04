import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  studentId: mongoose.Types.ObjectId;
  tutorId: mongoose.Types.ObjectId;
  senderRole: "student" | "tutor";
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}


const MessageSchema = new Schema<IMessage>(
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
    senderRole: {
      type: String,
      enum: ["student", "tutor"],
      required: true,
      default: "student",
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);
