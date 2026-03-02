import mongoose from "mongoose";
import { HttpError } from "../errors/http-error";
import { UserRepository } from "../repositories/user.repository";
import { MessageRepository } from "../repositories/message.repository";

const userRepository = new UserRepository();
const messageRepository = new MessageRepository();

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

    return await messageRepository.createMessage(studentId, tutorId, trimmedContent);
  }

  async getTutorMessages(tutorId: string) {
    if (!mongoose.Types.ObjectId.isValid(tutorId)) {
      throw new HttpError(400, "Invalid tutor id");
    }

    return await messageRepository.getMessagesByTutorId(tutorId);
  }

  async deleteTutorMessage(tutorId: string, messageId: string) {
    if (!mongoose.Types.ObjectId.isValid(tutorId)) {
      throw new HttpError(400, "Invalid tutor id");
    }

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      throw new HttpError(400, "Invalid message id");
    }

    const deletedMessage = await messageRepository.deleteTutorMessage(tutorId, messageId);

    if (!deletedMessage) {
      throw new HttpError(404, "Message not found");
    }

    return deletedMessage;
  }
}
