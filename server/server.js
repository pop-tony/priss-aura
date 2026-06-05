import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import https from "https";
import http from "http";
import fs from "fs";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import { connect } from 'http2';

//Create Express app and HTTP  server
const app = express();
const server = http.createServer(app);

//Middleware setup
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
// Allow requests from a specific origin
app.use(cors({
  origin: ['https://prissaura.vercel.app', 'http://localhost:5175', 'http://localhost:5174', 'http://localhost:5173', 'http://192.168.1.169:5173',],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

// API Endpoints
app.use('/api/status', (req, res) => res.send("API Working"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter);

await connectDB();

if(process.env.NODE_ENV !== "production"){
    const PORT = process.env.PORT || 5008;
    server.listen(PORT, ()=> console.log("Server Started on PORT: " + PORT));
}

//Export server for vercel
export default server;