import mongoose from "mongoose";
import { MessageModel } from "../models/message.model";

export class MessageRepository {
  async createMessage(
    studentId: string,
    tutorId: string,
    content: string,
    senderRole: "student" | "tutor" = "student"
  ) {
    const message = await MessageModel.create({
      studentId: new mongoose.Types.ObjectId(studentId),
      tutorId: new mongoose.Types.ObjectId(tutorId),
      senderRole,
      content,
      isRead: false,
    });

    return await MessageModel.findById(message._id)
      .populate("studentId", "fullName username profileImage")
      .populate("tutorId", "fullName username profileImage")
      .exec();
  }

  async getMessagesByTutorId(tutorId: string) {
    return await MessageModel.find({ tutorId: new mongoose.Types.ObjectId(tutorId) })
      .populate("studentId", "fullName username profileImage")
      .populate("tutorId", "fullName username profileImage")
      .sort({ createdAt: -1 })
      .exec();
  }

  async getMessagesByStudentId(studentId: string) {
    return await MessageModel.find({ studentId: new mongoose.Types.ObjectId(studentId) })
      .populate("studentId", "fullName username profileImage")
      .populate("tutorId", "fullName username profileImage")
      .sort({ createdAt: -1 })
      .exec();
  }

  async deleteMessageForUser(userId: string, messageId: string) {
    return await MessageModel.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(messageId),
      $or: [
        { tutorId: new mongoose.Types.ObjectId(userId) },
        { studentId: new mongoose.Types.ObjectId(userId) },
      ],
    }).exec();
  }

  async deleteConversationForUser(userId: string, partnerId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const partnerObjectId = new mongoose.Types.ObjectId(partnerId);

    return await MessageModel.deleteMany({
      $or: [
        { studentId: userObjectId, tutorId: partnerObjectId },
        { studentId: partnerObjectId, tutorId: userObjectId },
      ],
    }).exec();
  }
}
