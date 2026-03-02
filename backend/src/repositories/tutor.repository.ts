import { TutorModel } from "../models/tutor.model";

export class TutorRepository {
  async getTutors(includePassword: boolean = false) {
    const query = TutorModel.find({ role: "tutor" });
    if (!includePassword) {
      query.select("-password");
    }
    return await query.exec();
  }

  async getTutorById(id: string, includePassword: boolean = false) {
    const query = TutorModel.findOne({ _id: id, role: "tutor" });
    if (!includePassword) {
      query.select("-password");
    }
    return await query.exec();
  }
}
