import mongoose from "mongoose";
import { SavedTutorModel } from "../models/saved-tutor.model";

export class SavedTutorRepository {
  async findOne(studentId: string, tutorId: string) {
    return await SavedTutorModel.findOne({
      studentId: new mongoose.Types.ObjectId(studentId),
      tutorId: new mongoose.Types.ObjectId(tutorId),
    }).exec();
  }

  async create(studentId: string, tutorId: string) {
    return await SavedTutorModel.create({
      studentId: new mongoose.Types.ObjectId(studentId),
      tutorId: new mongoose.Types.ObjectId(tutorId),
    });
  }

  async getByStudentId(studentId: string) {
    return await SavedTutorModel.find({ studentId: new mongoose.Types.ObjectId(studentId) })
      .populate("tutorId", "fullName username profileImage subject rating pricePerHour")
      .sort({ createdAt: -1 })
      .exec();
  }

  async remove(studentId: string, tutorId: string) {
    return await SavedTutorModel.findOneAndDelete({
      studentId: new mongoose.Types.ObjectId(studentId),
      tutorId: new mongoose.Types.ObjectId(tutorId),
    }).exec();
  }
}
