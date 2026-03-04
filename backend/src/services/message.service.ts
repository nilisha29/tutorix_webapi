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

    return await messageRepository.createMessage(studentId, tutorId, trimmedContent, "student");
  }

  async replyToStudent(tutorId: string, studentId: string, content: string) {
    if (!mongoose.Types.ObjectId.isValid(tutorId)) {
      throw new HttpError(400, "Invalid tutor id");
    }

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new HttpError(400, "Invalid student id");
    }

    const tutor = await userRepository.getTutorById(tutorId, false);
    if (!tutor) {
      throw new HttpError(404, "Tutor not found");
    }

    const student = await userRepository.getUserById(studentId);
    if (!student) {
      throw new HttpError(404, "Student not found");
    }

    const trimmedContent = String(content || "").trim();
    if (!trimmedContent) {
      throw new HttpError(400, "Message content is required");
    }

    return await messageRepository.createMessage(studentId, tutorId, trimmedContent, "tutor");
  }

  
  async getTutorMessages(tutorId: string) {
    if (!mongoose.Types.ObjectId.isValid(tutorId)) {
      throw new HttpError(400, "Invalid tutor id");
    }

    return await messageRepository.getMessagesByTutorId(tutorId);
  }

  async getStudentMessages(studentId: string) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new HttpError(400, "Invalid student id");
    }

    return await messageRepository.getMessagesByStudentId(studentId);
  }

  async deleteMessageForUser(userId: string, messageId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new HttpError(400, "Invalid user id");
    }

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      throw new HttpError(400, "Invalid message id");
    }

    const deletedMessage = await messageRepository.deleteMessageForUser(userId, messageId);

    if (!deletedMessage) {
      throw new HttpError(404, "Message not found");
    }

    return deletedMessage;
  }

  async deleteConversationForUser(userId: string, partnerId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new HttpError(400, "Invalid user id");
    }

    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      throw new HttpError(400, "Invalid partner id");
    }

    if (String(userId) === String(partnerId)) {
      throw new HttpError(400, "Invalid conversation partner");
    }

    const result = await messageRepository.deleteConversationForUser(userId, partnerId);
    return {
      deletedCount: result.deletedCount || 0,
    };
  }
}
