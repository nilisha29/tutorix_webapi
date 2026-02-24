import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { connectDatabase } from './database/mongodb';
import { PORT } from './config';
import authRoutes from "./routes/auth.route";
import tutorRoutes from "./routes/tutor.route";
import bookingRoutes from "./routes/booking.route";
import cors from 'cors';
import path from 'path';


import adminUserRoutes from "./routes/admin/user.route";



const app: Application = express();

// app.use(
//   cors({
//     origin: "http://localhost:3000", // Next.js
//     credentials: true,
//   })
// );

const corsOptions = {
    origin:[ 'http://localhost:3000', 'http://localhost:3003', 'http://localhost:3005' ],
    optionsSuccessStatus: 200,
    credentials: true,
};
app.use(cors(corsOptions));


app.use("/uploads", express.static(path.join(__dirname, '../uploads'))); // static file serving

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/bookings', bookingRoutes);

app.use('/api/admin/users', adminUserRoutes);


app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({ success: "true", message: "Welcome to the API" });
});

async function startServer() {
    await connectDatabase();

    app.listen(
        PORT,
        () => {
            console.log(`Server: http://localhost:${PORT}`);
        }
    );
}


startServer();