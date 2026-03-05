import bcryptjs from "bcryptjs";
import { CreateUserDTO, UpdateUserDto } from "../../dtos/user.dto";
import { HttpError } from "../../errors/http-error";
import { UserRepository } from "../../repositories/user.repository";

const userRepository = new UserRepository();

export class AdminTutorService {
  async createTutor(data: CreateUserDTO) {
    const emailCheck = await userRepository.getUserByEmail(data.email);
    if (emailCheck) {
      throw new HttpError(403, "Email already in use");
    }

    const usernameCheck = await userRepository.getUserByUsername(data.username);
    if (usernameCheck) {
      throw new HttpError(403, "Username already in use");
    }

    const hashedPassword = await bcryptjs.hash(data.password, 10);
    const payload: any = {
      ...data,
      password: hashedPassword,
      role: "tutor",
      tutorOrigin: "admin",
    };

    return await userRepository.createUser(payload);
  }

  async getAllTutors() {
    return await userRepository.getUsersByRole("tutor", false);
  }

  async getTutorById(id: string) {
    const tutor = await userRepository.getTutorById(id, false);
    if (!tutor) {
      throw new HttpError(404, "Tutor not found");
    }
    return tutor;
  }

  async updateTutor(id: string, data: UpdateUserDto) {
    const tutor = await userRepository.getTutorById(id, false);
    if (!tutor) {
      throw new HttpError(404, "Tutor not found");
    }

    const nextData: any = {
      ...data,
      role: "tutor",
      tutorOrigin: "admin",
    };

    if (nextData.password) {
      nextData.password = await bcryptjs.hash(nextData.password, 10);
    }

    return await userRepository.updateUser(id, nextData);
  }

  async deleteTutor(id: string) {
    const tutor = await userRepository.getTutorById(id, false);
    if (!tutor) {
      throw new HttpError(404, "Tutor not found");
    }

    return await userRepository.deleteUser(id);
  }
}
