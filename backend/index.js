import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

// Initialize express app
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});