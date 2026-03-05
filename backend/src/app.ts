// src/app.ts
import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';

import authRoutes from "./routes/auth.route";
import tutorRoutes from "./routes/tutor.route";
import bookingRoutes from "./routes/booking.route";
import messageRoutes from "./routes/message.route";
import savedTutorRoutes from "./routes/saved-tutor.route";
import adminUserRoutes from "./routes/admin/user.route";
import adminBookingRoutes from "./routes/admin/booking.route";
import adminPaymentRoutes from "./routes/admin/payment.route";
import adminReviewRoutes from "./routes/admin/review.route";
import adminTutorRoutes from "./routes/admin/tutor.route";

const app: Application = express();

// ===== CORS Configuration =====
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3003', 'http://localhost:3005'],
    optionsSuccessStatus: 200,
    credentials: true,
};
app.use(cors(corsOptions));

// ===== Static File Serving =====
app.use("/uploads", express.static(path.join(__dirname, '../uploads')));

// ===== Body Parser =====
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ===== API Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/saved-tutors', savedTutorRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/bookings', adminBookingRoutes);
app.use('/api/admin/payments', adminPaymentRoutes);
app.use('/api/admin/reviews', adminReviewRoutes);
app.use('/api/admin/tutors', adminTutorRoutes);

// ===== Root Route =====
app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({ success: true, message: "Welcome to the API" });
});

export default app;