import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const app = express()

app.use(cors({
    origin: ['*', "http://localhost:5173", "http://localhost:51734"], credentials: true
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.static('public'))
app.use(cookieParser())


// routes
// import routes
import { userRouter } from "./routes/user.routes.js";
import { videoRouter } from "./routes/video.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)