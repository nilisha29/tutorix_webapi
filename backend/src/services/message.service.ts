import mongoose from "mongoose";
import { HttpError } from "../errors/http-error";
import { MessageModel } from "../models/message.model";
import { UserRepository } from "../repositories/user.repository";

const userRepository = new UserRepository();

export class MessageService {
  async sendMessage(studentId: string, tutorId: string, content: string) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new HttpError(400, "Invalid student id");
    }

    if (!mongoose.Types.ObjectId.isValid(tutorId)) {
      throw new HttpError(400, "Invalid tutor id");
    }

    const tutor = await userRepository.getTutorById(tutorId, false);
    if (!tutor) {
      throw new HttpError(404, "Tutor not found");
    }

    const trimmedContent = String(content || "").trim();
    if (!trimmedContent) {
      throw new HttpError(400, "Message content is required");
    }

    const message = await MessageModel.create({
      studentId: new mongoose.Types.ObjectId(studentId),
      tutorId: new mongoose.Types.ObjectId(tutorId),
      content: trimmedContent,
      isRead: false,
    });

    return await MessageModel.findById(message._id)
      .populate("studentId", "fullName username profileImage")
      .populate("tutorId", "fullName username profileImage")
      .exec();
  }

  async getTutorMessages(tutorId: string) {
    if (!mongoose.Types.ObjectId.isValid(tutorId)) {
      throw new HttpError(400, "Invalid tutor id");
    }

    return await MessageModel.find({ tutorId: new mongoose.Types.ObjectId(tutorId) })
      .populate("studentId", "fullName username profileImage")
      .sort({ createdAt: -1 })
      .exec();
  }

  async deleteTutorMessage(tutorId: string, messageId: string) {
    if (!mongoose.Types.ObjectId.isValid(tutorId)) {
      throw new HttpError(400, "Invalid tutor id");
    }

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      throw new HttpError(400, "Invalid message id");
    }

    const deletedMessage = await MessageModel.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(messageId),
      tutorId: new mongoose.Types.ObjectId(tutorId),
    }).exec();

    if (!deletedMessage) {
      throw new HttpError(404, "Message not found");
    }

    return deletedMessage;
  }
}
