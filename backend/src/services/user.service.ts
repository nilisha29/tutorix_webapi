import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { UserRepository } from "../repositories/user.repository";
import bcryptjs from "bcryptjs";
import { HttpError } from "../errors/http-error";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

const userRepository = new UserRepository();

export class UserService {
  async createUser(data: CreateUserDTO) {
    // Check email uniqueness
    const emailExists = await userRepository.getUserByEmail(data.email);
    if (emailExists) {
      throw new HttpError(403, "Email already in use");
    }

    // Check username uniqueness
    const usernameExists = await userRepository.getUserByUsername(data.username);
    if (usernameExists) {
      throw new HttpError(403, "Username already in use");
    }
    

    // Hash password
    const hashedPassword = await bcryptjs.hash(data.password, 10);
    data.password = hashedPassword;

    // Create user
    const newUser = await userRepository.createUser(data);
    return newUser;
  }

  async loginUser(data: LoginUserDTO) {
    const user = await userRepository.getUserByEmail(data.email);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    // Compare password
    const isPasswordValid = await bcryptjs.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new HttpError(401, "Invalid credentials");
    }

    // JWT payload
    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "30d",
    });

    // Remove password before sending response
    const { password, ...safeUser } = user.toObject();

    return { token, user: safeUser };
  }
}
