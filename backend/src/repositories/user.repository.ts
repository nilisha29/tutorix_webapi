import { UserModel, IUser } from "../models/user.model";

export interface IUserRepository {
    getUserByEmail(email: string): Promise<IUser | null>;
    getUserByUsername(username: string): Promise<IUser | null>;
    // Additional
    // 5 common database queries for entity
    createUser(userData: Partial<IUser>): Promise<IUser>;
    getUserById(id: string): Promise<IUser | null>;
    getAllUsers(): Promise<IUser[]>;
    getUsersByRole(role: string, includePassword?: boolean): Promise<IUser[]>;
    getTutorById(id: string, includePassword?: boolean): Promise<IUser | null>;
    addTutorReview(
        tutorId: string,
        reviewData: {
            reviewerId: string;
            name: string;
            detail: string;
            profileImage?: string;
            quote: string;
            rating: number;
        }
    ): Promise<IUser | null>;
    updateTutorReviewByReviewerId(
        tutorId: string,
        reviewerId: string,
        reviewData: { quote?: string; rating?: number }
    ): Promise<IUser | null>;
    deleteTutorReviewByReviewerId(tutorId: string, reviewerId: string): Promise<IUser | null>;
    updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null>;
    deleteUser(id: string): Promise<boolean>;
    getUserByResetPasswordToken(token: string): Promise<IUser | null>;
    setResetPasswordToken(userId: string, token: string, expiresAt: Date): Promise<IUser | null>;
    clearResetPasswordToken(userId: string): Promise<IUser | null>;
}


// MongoDb Implementation of UserRepository
export class UserRepository implements IUserRepository {
    async createUser(userData: Partial<IUser>): Promise<IUser> {
        const user = new UserModel(userData); 
        return await user.save();
    }
    async getUserByEmail(email: string): Promise<IUser | null> {
        const user = await UserModel.findOne({ "email": email })
        return user;
    }
    async getUserByUsername(username: string): Promise<IUser | null> {
        const user = await UserModel.findOne({ "username": username })
        return user;
    }

    async getUserById(id: string): Promise<IUser | null> {
        // UserModel.findOne({ "_id": id });
        const user = await UserModel.findById(id);
        return user;
    }
    async getAllUsers(): Promise<IUser[]> {
        const users = await UserModel.find();
        return users;
    }
    async getUsersByRole(role: string, includePassword: boolean = false): Promise<IUser[]> {
        const query = UserModel.find({ role });
        if (!includePassword) {
            query.select("-password");
        }
        return await query.exec();
    }
    async getTutorById(id: string, includePassword: boolean = false): Promise<IUser | null> {
        const query = UserModel.findOne({ _id: id, role: "tutor" });
        if (!includePassword) {
            query.select("-password");
        }
        return await query.exec();
    }
    async addTutorReview(
        tutorId: string,
        reviewData: {
            reviewerId: string;
            name: string;
            detail: string;
            profileImage?: string;
            quote: string;
            rating: number;
        }
    ): Promise<IUser | null> {
        const tutor = await UserModel.findOne({ _id: tutorId, role: "tutor" });
        if (!tutor) {
            return null;
        }

        const reviews: any[] = Array.isArray(tutor.reviews) ? [...tutor.reviews] : [];
        const existingIndex = reviews.findIndex(
            (review) => String(review?.reviewerId || "") === reviewData.reviewerId
        );

        const nextReview = {
            reviewerId: reviewData.reviewerId,
            name: reviewData.name,
            detail: reviewData.detail,
            profileImage: reviewData.profileImage,
            quote: reviewData.quote,
            rating: reviewData.rating,
        };

        if (existingIndex >= 0) {
            reviews[existingIndex] = nextReview;
        } else {
            reviews.push(nextReview);
        }

        const ratings = reviews
            .map((review) => Number(review?.rating || 0))
            .filter((rating) => rating > 0);

        const averageRating = ratings.length
            ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
            : tutor.rating || 0;

        tutor.reviews = reviews as any;
        tutor.reviewsCount = reviews.length;
        tutor.rating = Number(averageRating.toFixed(1));

        await tutor.save();
        return await UserModel.findOne({ _id: tutorId, role: "tutor" }).select("-password").exec();
    }
    async updateTutorReviewByReviewerId(
        tutorId: string,
        reviewerId: string,
        reviewData: { quote?: string; rating?: number }
    ): Promise<IUser | null> {
        const tutor = await UserModel.findOne({ _id: tutorId, role: "tutor" });
        if (!tutor) {
            return null;
        }

        const reviews: any[] = Array.isArray(tutor.reviews) ? [...tutor.reviews] : [];
        const reviewIndex = reviews.findIndex(
            (review) => String(review?.reviewerId || "") === reviewerId
        );

        if (reviewIndex < 0) {
            return null;
        }

        reviews[reviewIndex] = {
            ...reviews[reviewIndex],
            ...(reviewData.quote !== undefined ? { quote: reviewData.quote } : {}),
            ...(reviewData.rating !== undefined ? { rating: reviewData.rating } : {}),
        };

        const ratings = reviews
            .map((review) => Number(review?.rating || 0))
            .filter((rating) => rating > 0);

        const averageRating = ratings.length
            ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
            : 0;

        tutor.reviews = reviews as any;
        tutor.reviewsCount = reviews.length;
        tutor.rating = Number(averageRating.toFixed(1));
        await tutor.save();

        return await UserModel.findOne({ _id: tutorId, role: "tutor" }).select("-password").exec();
    }
    async deleteTutorReviewByReviewerId(tutorId: string, reviewerId: string): Promise<IUser | null> {
        const tutor = await UserModel.findOne({ _id: tutorId, role: "tutor" });
        if (!tutor) {
            return null;
        }

        const reviews: any[] = Array.isArray(tutor.reviews) ? [...tutor.reviews] : [];
        const nextReviews = reviews.filter(
            (review) => String(review?.reviewerId || "") !== reviewerId
        );

        if (nextReviews.length === reviews.length) {
            return null;
        }

        const ratings = nextReviews
            .map((review) => Number(review?.rating || 0))
            .filter((rating) => rating > 0);

        const averageRating = ratings.length
            ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
            : 0;

        tutor.reviews = nextReviews as any;
        tutor.reviewsCount = nextReviews.length;
        tutor.rating = Number(averageRating.toFixed(1));
        await tutor.save();

        return await UserModel.findOne({ _id: tutorId, role: "tutor" }).select("-password").exec();
    }
    async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
        // UserModel.updateOne({ _id: id }, { $set: updateData });
        const updatedUser = await UserModel.findByIdAndUpdate(
            id, updateData, { new: true } // return the updated document
        );
        return updatedUser;
    }
    async deleteUser(id: string): Promise<boolean> {
        // UserModel.deleteOne({ _id: id });
        const result = await UserModel.findByIdAndDelete(id);
        return result ? true : false;
    }

    async getUserByResetPasswordToken(token: string): Promise<IUser | null> {
        return await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: new Date() },
        }).exec();
    }

    async setResetPasswordToken(userId: string, token: string, expiresAt: Date): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    resetPasswordToken: token,
                    resetPasswordExpiresAt: expiresAt,
                },
            },
            { new: true }
        ).exec();
    }

    async clearResetPasswordToken(userId: string): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(
            userId,
            {
                $unset: {
                    resetPasswordToken: 1,
                    resetPasswordExpiresAt: 1,
                },
            },
            { new: true }
        ).exec();
    }
}