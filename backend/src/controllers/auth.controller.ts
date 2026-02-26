// import { Request, Response } from "express";
// import { z } from "zod";

// import { UserService } from "../services/user.service";
// import { CreateUserDTO, LoginUserDTO, UpdateUserDto } from "../dtos/user.dto";

// const userService = new UserService();


// type CreateUserInput = z.infer<typeof CreateUserDTO>;
// type LoginUserInput = z.infer<typeof LoginUserDTO>;

// export class AuthController {
//   // async register(req: Request, res: Response) {
//   //   try {
//   //     const parsedData = CreateUserDTO.safeParse(req.body);

//   //     if (!parsedData.success) {
//   //       return res.status(400).json({
//   //         success: false,
//   //         errors: parsedData.error.flatten(),
//   //       });
//   //     }

//   //     const userData: CreateUserInput = parsedData.data;

//   //     const newUser = await userService.createUser(userData);

//   //     return res.status(201).json({
//   //       success: true,
//   //       message: "User created successfully",
//   //       data: newUser,
//   //     });
//   //   } catch (error: any) {
//   //     console.error("Registration Error:", error);
//   //     return res.status(error.statusCode || 500).json({
//   //       success: false,
//   //       message: error.message || "Internal Server Error",
//   //     });
//   //   }
//   // }

//   async register(req: Request, res: Response) {
//   try {
//     const parsedData = CreateUserDTO.safeParse(req.body);

//     if (!parsedData.success) {
//       return res.status(400).json({
//         success: false,
//         errors: parsedData.error.flatten(),
//       });
//     }

//     const userData: CreateUserInput = parsedData.data;

//     // ✅ HANDLE PROFILE IMAGE (IMPORTANT)
//     if (req.file) {
//       userData.profileImage = `/uploads/${req.file.filename}`;
//     }

//     const newUser = await userService.createUser(userData);

//     return res.status(201).json({
//       success: true,
//       message: "User created successfully",
//       data: newUser,
//     });
//   } catch (error: any) {
//     console.error("Registration Error:", error);
//     return res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || "Internal Server Error",
//     });
//   }
// }


//   async login(req: Request, res: Response) {
//     try {
//       const parsedData = LoginUserDTO.safeParse(req.body);

//       if (!parsedData.success) {
//         return res.status(400).json({
//           success: false,
//           errors: parsedData.error.flatten(),
//         });
//       }

//       const loginData: LoginUserInput = parsedData.data;

//       const { token, user } = await userService.loginUser(loginData);

//       return res.status(200).json({
//         success: true,
//         message: "Login successful",
//         token,
//         data: user,
//       });
//     } catch (error: any) {
//       return res.status(error.statusCode || 500).json({
//         success: false,
//         message: error.message || "Internal Server Error",
//       });
//     }
//   }

//    async getProfile(req: Request, res: Response) {
//         try{
//             const userId = req.user?._id;
//             if(!userId){
//                 return res.status(400).json(
//                     { success: false, message: "User Id Not found" }
//                 );
//             }
//             const user = await userService.getUserById(userId);
//             return res.status(200).json(
//                 { success: true, data: user, message: "User profile fetched successfully" }
//             );
//         }catch(error: Error | any){
//             return res.status(error.statusCode || 500).json(
//                 { success: false, message: error.message || "Internal Server Error" }
//             );
//         }
//     }

//     async updateProfile(req: Request, res: Response) {
//         try{
//             const userId = req.user?._id;
//             if(!userId){
//                 return res.status(400).json(
//                     { success: false, message: "User Id Not found" }
//                 );
//             }
//             const parsedData = UpdateUserDto.safeParse(req.body);
//             if (!parsedData.success) {
//                 return res.status(400).json(
//                     { success: false, message: z.prettifyError(parsedData.error) }
//                 ); // z.prettifyError - better error messages (zod)
//             }
//             if(req.file){
//                 parsedData.data.profileImage = `/uploads/${req.file.filename}`;
//             }
//             const updatedUser = await userService.updateUser(userId, parsedData.data);
//             return res.status(200).json(
//                 { success: true, data: updatedUser, message: "User profile updated successfully" }
//             );
//         }catch(error: Error | any){
//             return res.status(error.statusCode || 500).json(
//                 { success: false, message: error.message || "Internal Server Error" }
//             );
//         }
//     }
// }



// import { Request, Response } from "express";
// import { z } from "zod";

// import { UserService } from "../services/user.service";
// import { CreateUserDTO, LoginUserDTO, UpdateUserDto } from "../dtos/user.dto";

// const userService = new UserService();

// type CreateUserInput = z.infer<typeof CreateUserDTO>;
// type LoginUserInput = z.infer<typeof LoginUserDTO>;

// export class AuthController {

//   // =========================
//   // REGISTER
//   // =========================
//   async register(req: Request, res: Response) {
//     try {
//       const parsedData = CreateUserDTO.safeParse(req.body);

//       if (!parsedData.success) {
//         return res.status(400).json({
//           success: false,
//           errors: parsedData.error.flatten(),
//         });
//       }

//       const userData: CreateUserInput = parsedData.data;

//       // Handle profile image
//       if (req.file) {
//         userData.profileImage = `/uploads/${req.file.filename}`;
//       }

//       const newUser = await userService.createUser(userData);

//       return res.status(201).json({
//         success: true,
//         message: "User created successfully",
//         data: newUser,
//       });
//     } catch (error: any) {
//       console.error("Registration Error:", error);
//       return res.status(error.statusCode || 500).json({
//         success: false,
//         message: error.message || "Internal Server Error",
//       });
//     }
//   }

//   // =========================
//   // LOGIN
//   // =========================
//   async login(req: Request, res: Response) {
//     try {
//       const parsedData = LoginUserDTO.safeParse(req.body);

//       if (!parsedData.success) {
//         return res.status(400).json({
//           success: false,
//           errors: parsedData.error.flatten(),
//         });
//       }

//       const loginData: LoginUserInput = parsedData.data;

//       const { token, user } = await userService.loginUser(loginData);

//       return res.status(200).json({
//         success: true,
//         message: "Login successful",
//         token,
//         data: user,
//       });
//     } catch (error: any) {
//       return res.status(error.statusCode || 500).json({
//         success: false,
//         message: error.message || "Internal Server Error",
//       });
//     }
//   }

//   // =========================
//   // GET PROFILE
//   // =========================
//   async getProfile(req: Request, res: Response) {
//     try {
//       const userId = req.user?._id;
//       if (!userId) {
//         return res.status(400).json({ success: false, message: "User ID not found" });
//       }

//       const user = await userService.getUserById(userId);
//       return res.status(200).json({
//         success: true,
//         message: "User profile fetched successfully",
//         data: user,
//       });
//     } catch (error: any) {
//       return res.status(error.statusCode || 500).json({
//         success: false,
//         message: error.message || "Internal Server Error",
//       });
//     }
//   }

//   // =========================
//   // UPDATE PROFILE
//   // =========================
//   async updateProfile(req: Request, res: Response) {
//     try {
//       const userId = req.user?._id;
//       if (!userId) {
//         return res.status(400).json({ success: false, message: "User ID not found" });
//       }

//       const parsedData = UpdateUserDto.safeParse(req.body);
//       if (!parsedData.success) {
//         return res.status(400).json({
//           success: false,
//           message: z.prettifyError(parsedData.error),
//         });
//       }

//       // Handle new profile image
//       if (req.file) {
//         parsedData.data.profileImage = `/uploads/${req.file.filename}`;
//       }

//       const updatedUser = await userService.updateUser(userId, parsedData.data);
//       return res.status(200).json({
//         success: true,
//         message: "User profile updated successfully",
//         data: updatedUser,
//       });
//     } catch (error: any) {
//       return res.status(error.statusCode || 500).json({
//         success: false,
//         message: error.message || "Internal Server Error",
//       });
//     }
//   }
// }



import { Request, Response } from "express";
import { z } from "zod";

import { UserService } from "../services/user.service";
import {
  CreateUserDTO,
  LoginUserDTO,
  UpdateUserDto,
  BecomeTutorDTO,
  AddTutorReviewDTO,
} from "../dtos/user.dto";

const userService = new UserService();

type CreateUserInput = z.infer<typeof CreateUserDTO>;
type LoginUserInput = z.infer<typeof LoginUserDTO>;

export class AuthController {
  async sendResetPasswordEmail(req: Request, res: Response) {
    try {
      const email = String(req.body?.email || "").trim().toLowerCase();
      const result = await userService.sendResetPasswordEmail(email);

      return res.status(200).json({
        success: true,
        data: result.user,
        message: result.message,
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async resetPasswordWithToken(req: Request, res: Response) {
    try {
      const token = String(req.params.token || "").trim();
      const newPassword = String(req.body?.newPassword || req.body?.password || "");

      const result = await userService.resetPasswordByToken(token, newPassword);
      return res.status(200).json({
        success: true,
        message: result.message || "Password has been reset successfully.",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const email = String(req.body?.email || "").trim().toLowerCase();
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const result = await userService.forgotPassword(email);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const token = String(req.body?.token || "").trim();
      const password = String(req.body?.password || "");

      if (!token || !password) {
        return res.status(400).json({
          success: false,
          message: "Token and new password are required",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      const result = await userService.resetPassword(token, password);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // =========================
  // REGISTER
  // =========================
  async register(req: Request, res: Response) {
    try {
      const parsedData = CreateUserDTO.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          errors: parsedData.error.flatten(),
        });
      }

      const userData: CreateUserInput = parsedData.data;

      // ✅ FIX: store FULL image URL (important for Flutter)
      if (req.file) {
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        userData.profileImage = `${baseUrl}/uploads/${req.file.filename}`;
      }

      const newUser = await userService.createUser(userData);

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser,
      });
    } catch (error: any) {
      console.error("Registration Error:", error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // =========================
  // LOGIN
  // =========================
  async login(req: Request, res: Response) {
    try {
      const parsedData = LoginUserDTO.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          errors: parsedData.error.flatten(),
        });
      }

      const loginData: LoginUserInput = parsedData.data;

      const { token, user } = await userService.loginUser(loginData);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        data: user,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // =========================
  // GET PROFILE
  // =========================
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?._id;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID not found",
        });
      }

      const user = await userService.getUserById(userId);

      return res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        data: user,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // =========================
  // UPDATE PROFILE
  // =========================
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?._id;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID not found",
        });
      }

      const parsedData = UpdateUserDto.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      // ✅ FIX: store FULL image URL
      if (req.file) {
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        parsedData.data.profileImage = `${baseUrl}/uploads/${req.file.filename}`;
      }

      const updatedUser = await userService.updateUser(
        userId,
        parsedData.data
      );

      return res.status(200).json({
        success: true,
        message: "User profile updated successfully",
        data: updatedUser,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  
  // =========================
  // BECOME TUTOR
  // =========================
  async becomeTutor(req: Request, res: Response) {
    try {
      const userId = req.user?._id;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID not found",
        });
      }

      // Debug: log incoming data EXACTLY as received
      console.log("\n========== [becomeTutor] REQUEST DEBUG ==========");
      console.log("[becomeTutor] RAW req.body:", req.body);
      console.log("[becomeTutor] Keys in req.body:", Object.keys(req.body));
      console.log("[becomeTutor] Field types:");
      console.log("  - languages:", typeof req.body.languages, "value:", JSON.stringify(req.body.languages));
      console.log("  - tags:", typeof req.body.tags, "value:", JSON.stringify(req.body.tags));
      console.log("  - education:", typeof req.body.education, "value:", JSON.stringify(req.body.education));
      console.log("  - availabilitySlots:", typeof req.body.availabilitySlots, "value:", JSON.stringify(req.body.availabilitySlots));

      // Validate incoming data with preprocessing for arrays
      const parsedData = BecomeTutorDTO.safeParse(req.body);

      console.log("\n[becomeTutor] Zod validation result:");
      console.log("  - success:", parsedData.success);
      if (!parsedData.success) {
        console.log("  - errors:", JSON.stringify(parsedData.error.flatten(), null, 2));
      } else {
        console.log("  - parsed data:", JSON.stringify(parsedData.data, null, 2));
      }
      console.log("========== END DEBUG ==========\n");

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const updatedUser = await userService.becomeTutor(
        userId,
        parsedData.data
      );

      return res.status(200).json({
        success: true,
        message: "Successfully became a tutor",
        data: updatedUser,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // =========================
  // UPDATE USER BY ID (ADMIN/PROTECTED)
  // =========================
  async updateUserById(req: Request, res: Response) {
    try {
      const userId = req.params.id;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID not found",
        });
      }

      const parsedData = UpdateUserDto.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      if (req.file) {
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        parsedData.data.profileImage = `${baseUrl}/uploads/${req.file.filename}`;
      }

      const updatedUser = await userService.updateUser(userId, parsedData.data);

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }



  // =========================
  // GET TUTORS (PUBLIC)
  // =========================
  async getTutors(req: Request, res: Response) {
    try {
      const tutors = await userService.getTutors();
      return res.status(200).json({
        success: true,
        message: "Tutors retrieved successfully",
        data: tutors,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // =========================
  // GET TUTOR BY ID (PUBLIC)
  // =========================
  async getTutorById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tutor = await userService.getTutorById(id);
      return res.status(200).json({
        success: true,
        message: "Tutor retrieved successfully",
        data: tutor,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }


  
  async addTutorReview(req: Request, res: Response) {
    try {
      const reviewerId = req.user?._id;
      const { id } = req.params;

      if (!reviewerId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const parsedData = AddTutorReviewDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          errors: parsedData.error.flatten(),
        });
      }

      const tutor = await userService.addTutorReview(id, String(reviewerId), parsedData.data);
      return res.status(200).json({
        success: true,
        message: "Review submitted successfully",
        data: tutor,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
