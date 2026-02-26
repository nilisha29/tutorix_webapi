import mongoose from "mongoose";
import { HttpError } from "../errors/http-error";
import { SavedTutorModel } from "../models/saved-tutor.model";
import { UserRepository } from "../repositories/user.repository";

const userRepository = new UserRepository();

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

    const existing = await SavedTutorModel.findOne({
      studentId: new mongoose.Types.ObjectId(studentId),
      tutorId: new mongoose.Types.ObjectId(tutorId),
    }).exec();

    if (existing) {
      return existing;
    }

    return await SavedTutorModel.create({
      studentId: new mongoose.Types.ObjectId(studentId),
      tutorId: new mongoose.Types.ObjectId(tutorId),
    });
  }

  async getSavedTutors(studentId: string) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new HttpError(400, "Invalid student id");
    }

    return await SavedTutorModel.find({ studentId: new mongoose.Types.ObjectId(studentId) })
      .populate("tutorId", "fullName username profileImage subject rating pricePerHour")
      .sort({ createdAt: -1 })
      .exec();
  }

  async removeSavedTutor(studentId: string, tutorId: string) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new HttpError(400, "Invalid student id");
    }

    if (!mongoose.Types.ObjectId.isValid(tutorId)) {
      throw new HttpError(400, "Invalid tutor id");
    }

    const removed = await SavedTutorModel.findOneAndDelete({
      studentId: new mongoose.Types.ObjectId(studentId),
      tutorId: new mongoose.Types.ObjectId(tutorId),
    }).exec();

    return !!removed;
  }
}
