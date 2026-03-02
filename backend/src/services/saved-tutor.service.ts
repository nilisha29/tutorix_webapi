import mongoose from "mongoose";
import { HttpError } from "../errors/http-error";
import { UserRepository } from "../repositories/user.repository";
import { SavedTutorRepository } from "../repositories/saved-tutor.repository";

const userRepository = new UserRepository();
const savedTutorRepository = new SavedTutorRepository();

export class SavedTutorService {
  async saveTutor(studentId: string, tutorId: string) {
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

    const existing = await savedTutorRepository.findOne(studentId, tutorId);

    if (existing) {
      return existing;
    }

    return await savedTutorRepository.create(studentId, tutorId);
  }

  async getSavedTutors(studentId: string) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new HttpError(400, "Invalid student id");
    }

    return await savedTutorRepository.getByStudentId(studentId);
  }

  async removeSavedTutor(studentId: string, tutorId: string) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new HttpError(400, "Invalid student id");
    }

    if (!mongoose.Types.ObjectId.isValid(tutorId)) {
      throw new HttpError(400, "Invalid tutor id");
    }

    const removed = await savedTutorRepository.remove(studentId, tutorId);

    return !!removed;
  }
}
