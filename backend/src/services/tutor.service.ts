import { UserService } from "./user.service";
import { TutorRepository } from "../repositories/tutor.repository";

const userService = new UserService();
const tutorRepository = new TutorRepository();

export class TutorService {
  async getTutors() {
    return await tutorRepository.getTutors(false);
  }

  async getTutorById(tutorId: string) {
    const tutor = await tutorRepository.getTutorById(tutorId, false);
    if (!tutor) {
      return await userService.getTutorById(tutorId);
    }
    return tutor;
  }

  async becomeTutor(userId: string, tutorData: any) {
    return await userService.becomeTutor(userId, tutorData);
  }
}
