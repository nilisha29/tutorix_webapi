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
import crypto from "crypto";
import { sendEmail } from "../config/email";

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

    if (Array.isArray((tutor as any).reviews) && (tutor as any).reviews.length > 0) {
      const hydratedReviews = await Promise.all(
        (tutor as any).reviews.map(async (review: any) => {
          if (review?.profileImage) {
            return review;
          }
          const reviewerId = review?.reviewerId;
          if (!reviewerId) {
            return review;
          }
          const reviewer = await userRepository.getUserById(String(reviewerId));
          if (!reviewer) {
            return review;
          }
          return {
            ...review,
            name: review?.name || reviewer.fullName || reviewer.username || "User",
            detail: review?.detail || reviewer.username || reviewer.fullName || "",
            profileImage: reviewer.profileImage,
          };
        })
      );

      (tutor as any).reviews = hydratedReviews;
    }

    return tutor;
  }

  // =========================
  // BECOME A TUTOR
  // =========================
  async becomeTutor(userId: string, tutorData: any) {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    if (user.role === "tutor") {
      throw new HttpError(400, "User is already a tutor");
    }

    // Helper to convert strings to arrays or pass through existing arrays
    const parseStringArray = (value: any, separator: RegExp = /,/): string[] => {
      console.log("[becomeTutor parseStringArray] Input:", { value, type: typeof value });
      if (Array.isArray(value)) {
        console.log("[becomeTutor parseStringArray] Already array:", value);
        return value;
      }
      if (typeof value === "string") {
        if (!value.trim()) return [];
        const result = value.split(separator).map(s => s.trim()).filter(Boolean);
        console.log("[becomeTutor parseStringArray] Converted to array:", result);
        return result;
      }
      return [];
    };

    const parseEducationArray = (value: any): string[] => {
      console.log("[becomeTutor parseEducationArray] Input:", { value, type: typeof value });
      if (Array.isArray(value)) {
        console.log("[becomeTutor parseEducationArray] Already array:", value);
        return value;
      }
      if (typeof value === "string") {
        if (!value.trim()) return [];
        const result = value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
        console.log("[becomeTutor parseEducationArray] Converted to array:", result);
        return result;
      }
      return [];
    };

    const parseAvailabilitySlots = (value: any): any[] => {
      console.log("[becomeTutor parseAvailabilitySlots] Input:", { value, type: typeof value });
      if (Array.isArray(value)) {
        console.log("[becomeTutor parseAvailabilitySlots] Already array:", value);
        return value;
      }
      if (typeof value === "string") {
        if (!value.trim()) return [];
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            console.log("[becomeTutor parseAvailabilitySlots] Parsed JSON:", parsed);
            return parsed;
          }
        } catch (e) {
          console.log("[becomeTutor parseAvailabilitySlots] JSON parse failed:", e);
        }
      }
      return [];
    };

    // Prepare the update data
    const updateData: any = {
      role: "tutor",
      tutorOrigin: "self",
      about: tutorData.about,
      experienceYears: tutorData.experienceYears,
      responseTime: tutorData.responseTime,
      languages: parseStringArray(tutorData.languages, /,/),
      tags: parseStringArray(tutorData.tags, /,/),
      education: parseEducationArray(tutorData.education),
      availabilitySlots: parseAvailabilitySlots(tutorData.availabilitySlots),
      subject: tutorData.subject,
      gradeLevel: tutorData.gradeLevel,
      pricePerHour: tutorData.pricePerHour,
      rating: 5,
      reviewsCount: 0,
    };

    const updatedUser = await userRepository.updateUser(userId, updateData);
    return updatedUser;
  }

  async addTutorReview(
    tutorId: string,
    reviewerId: string,
    reviewData: { quote: string; rating: number }
  ) {
    const tutor = await userRepository.getTutorById(tutorId, false);
    if (!tutor) {
      throw new HttpError(404, "Tutor not found");
    }

    const reviewer = await userRepository.getUserById(reviewerId);
    if (!reviewer) {
      throw new HttpError(404, "User not found");
    }

    if (String(tutor._id) === String(reviewer._id)) {
      throw new HttpError(400, "You cannot review yourself");
    }

    const savedTutor = await userRepository.addTutorReview(tutorId, {
      reviewerId: String(reviewer._id),
      name: reviewer.fullName || reviewer.username || "User",
      detail: `${reviewer.username || reviewer.fullName}`,
      profileImage: reviewer.profileImage,
      quote: reviewData.quote,
      rating: reviewData.rating,
    });

    if (!savedTutor) {
      throw new HttpError(404, "Tutor not found");
    }

    return savedTutor;
  }

  async forgotPassword(email: string) {
    const user = await userRepository.getUserByEmail(email);

    if (!user) {
      return {
        success: true,
        message: "If that email is registered, a reset link has been generated.",
      };
    }

    
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await userRepository.setResetPasswordToken(String(user._id), hashedToken, expiresAt);

    const frontendBaseUrl = process.env.FRONTEND_BASE_URL || "http://localhost:3000";
    const resetUrl = `${frontendBaseUrl}/reset-password?token=${rawToken}`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2 style="margin-bottom: 8px;">Reset your Tutorix password</h2>
        <p>We received a request to reset your password.</p>
        <p>This link will expire in 15 minutes.</p>
        <p style="margin: 20px 0;">
          <a href="${resetUrl}" style="background: #2563eb; color: #fff; padding: 10px 16px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail(user.email, "Tutorix Password Reset", html);
    } catch (error) {
      await userRepository.clearResetPasswordToken(String(user._id));

      if (process.env.NODE_ENV !== "production") {
        return {
          success: true,
          message: "Email delivery failed in local environment. Use the debug reset link below.",
          resetUrl,
        };
      }

      throw new HttpError(500, "Failed to send reset password email");
    }

    if (process.env.NODE_ENV !== "production") {
      return {
        success: true,
        message: "If that email is registered, a reset link has been sent.",
        resetUrl,
      };
    }

    return {
      success: true,
      message: "If that email is registered, a reset link has been sent.",
    };
  }

  async sendResetPasswordEmail(email?: string) {
    if (!email) {
      throw new HttpError(400, "Email is required");
    }

    await this.forgotPassword(email);

    const user = await userRepository.getUserByEmail(email);
    return {
      success: true,
      user,
      message: "If the email is registered, a reset link has been sent.",
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await userRepository.getUserByResetPasswordToken(hashedToken);

    if (!user) {
      throw new HttpError(400, "Invalid or expired reset token");
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await userRepository.updateUser(String(user._id), {
      password: hashedPassword,
    } as any);
    await userRepository.clearResetPasswordToken(String(user._id));

    return {
      success: true,
      message: "Password reset successful. Please login with your new password.",
    };
  }

  async resetPasswordByToken(token?: string, newPassword?: string) {
    if (!token || !newPassword) {
      throw new HttpError(400, "Token and new password are required");
    }

    return await this.resetPassword(token, newPassword);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    const currentMatches = await bcryptjs.compare(currentPassword, user.password);
    if (!currentMatches) {
      throw new HttpError(400, "Current password is incorrect");
    }

    if (newPassword.length < 6) {
      throw new HttpError(400, "New password must be at least 6 characters");
    }

    const isSameAsCurrent = await bcryptjs.compare(newPassword, user.password);
    if (isSameAsCurrent) {
      throw new HttpError(400, "New password must be different from current password");
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await userRepository.updateUser(String(user._id), { password: hashedPassword } as any);

    return {
      success: true,
      message: "Password changed successfully",
    };
  }
}
