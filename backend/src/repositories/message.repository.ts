import mongoose from "mongoose";
import { MessageModel } from "../models/message.model";

export class MessageRepository {
  async createMessage(studentId: string, tutorId: string, content: string) {
    const message = await MessageModel.create({
      studentId: new mongoose.Types.ObjectId(studentId),
      tutorId: new mongoose.Types.ObjectId(tutorId),
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
      .sort({ createdAt: -1 })
      .exec();
  }

  async deleteTutorMessage(tutorId: string, messageId: string) {
    return await MessageModel.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(messageId),
      tutorId: new mongoose.Types.ObjectId(tutorId),
    }).exec();
  }
}
