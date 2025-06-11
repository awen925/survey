import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import surveyRoutes from './routes/survey';
import './models'; // Import models to initialize associations and sync database

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/survey', surveyRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
