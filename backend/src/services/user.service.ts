// import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
// import { UserRepository } from "../repositories/user.repository";
// import bcryptjs from "bcryptjs";
// import { HttpError } from "../errors/http-error";
// import jwt from "jsonwebtoken";
// import { JWT_SECRET } from "../config";

// const userRepository = new UserRepository();

// export class UserService {
//   async createUser(data: CreateUserDTO) {
//     // Check email uniqueness
//     const emailExists = await userRepository.getUserByEmail(data.email);
//     if (emailExists) {
//       throw new HttpError(403, "Email already in use");
//     }

//     // Check username uniqueness
//     const usernameExists = await userRepository.getUserByUsername(data.username);
//     if (usernameExists) {
//       throw new HttpError(403, "Username already in use");
//     }
    

//     // Hash password
//     const hashedPassword = await bcryptjs.hash(data.password, 10);
//     data.password = hashedPassword;

//     // Create user
//     const newUser = await userRepository.createUser({
//        fullName: data.fullName,
//     email: data.email,
//     username: data.username,
//     password: hashedPassword,
//     phoneNumber: data.phoneNumber,
//     address: data.address,
//     profileImage: data.profileImage,
//     });
//     return newUser;
//   }


// //   // Hash password
// // const hashedPassword = await bcryptjs.hash(data.password, 10);

// // // Remove confirmPassword before saving
// // const { confirmPassword, ...userData } = data;
// // userData.password = hashedPassword;

// // // Create user
// // const newUser = await userRepository.createUser(userData);
// // return newUser;
// //   }
//   async loginUser(data: LoginUserDTO) {
//     const user = await userRepository.getUserByEmail(data.email);
//     if (!user) {
//       throw new HttpError(404, "User not found");
//     }

//     // Compare password
//     const isPasswordValid = await bcryptjs.compare(
//       data.password,
//       user.password
//     );

//     if (!isPasswordValid) {
//       throw new HttpError(401, "Invalid credentials");
//     }

//     // JWT payload
//     const payload = {
//       id: user._id,
//       email: user.email,
//       username: user.username,
//       role: user.role,
//     };

//     const token = jwt.sign(payload, JWT_SECRET, {
//       expiresIn: "30d",
//     });

//     // Remove password before sending response
//     const { password, ...safeUser } = user.toObject();

//     return { token, user: safeUser };
//   }
//   async getUserById(userId: string) {
//         const user = await userRepository.getUserById(userId);
//         if (!user) {
//             throw new HttpError(404, "User not found");
//         }
//         return user;
//     }

//     async updateUser(userId: string, data: Partial<CreateUserDTO>) {
//         const user = await userRepository.getUserById(userId);
//         if (!user) {
//             throw new HttpError(404, "User not found");
//         }

//         // If password is being updated, hash it
//         if (data.password) {
//             data.password = await bcryptjs.hash(data.password, 10);
//         }

//         const updatedUser = await userRepository.updateUser(userId, data);
//         return updatedUser;
//     }
// }


import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { UserRepository } from "../repositories/user.repository";
import bcryptjs from "bcryptjs";
import { HttpError } from "../errors/http-error";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

const userRepository = new UserRepository();

export class UserService {
  // =========================
  // CREATE USER
  // =========================
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

    // Create user in DB
    const newUser = await userRepository.createUser({
      fullName: data.fullName,
      email: data.email,
      username: data.username,
      password: hashedPassword,
      phoneNumber: data.phoneNumber,
      address: data.address,
      profileImage: data.profileImage, // Path from controller
    });

    return newUser;
  }

  // =========================
  // LOGIN USER
  // =========================
  async loginUser(data: LoginUserDTO) {
    const user = await userRepository.getUserByEmail(data.email);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    // Compare password
    const isPasswordValid = await bcryptjs.compare(data.password, user.password);
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

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });

    // Remove password before sending
    const { password, ...safeUser } = user.toObject();

    return { token, user: safeUser };
  }

  // =========================
  // GET USER BY ID
  // =========================
  async getUserById(userId: string) {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    return user;
  }

  // =========================
  // UPDATE USER
  // =========================
  async updateUser(userId: string, data: Partial<CreateUserDTO>) {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    // Hash password if provided
    if (data.password) {
      data.password = await bcryptjs.hash(data.password, 10);
    }

    const updatedUser = await userRepository.updateUser(userId, data);
    return updatedUser;
  }

  // =========================
  // GET TUTORS (PUBLIC)
  // =========================
  async getTutors() {
    const tutors = await userRepository.getUsersByRole("tutor", false);
    return tutors;
  }

  // =========================
  // GET TUTOR BY ID (PUBLIC)
  // =========================
  async getTutorById(tutorId: string) {
    const tutor = await userRepository.getTutorById(tutorId, false);
    if (!tutor) {
      throw new HttpError(404, "Tutor not found");
    }
    return tutor;
  }
}
