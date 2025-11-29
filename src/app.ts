import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth.routes';
import itemRoutes from './routes/itemRoutes';
import userRoutes from './routes/user.routes';
import leadRoutes from './routes/lead.routes';
import callTaskRoutes from './routes/callTask.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/call-tasks', callTaskRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Unite Backend API', status: 'running' });
});

// Global error handler (should be after routes)
app.use(errorHandler);

app.use((err: any, req: any, res: any, next: any) => {
  console.error('🔥 Global Error Handler:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Sync Database (Create tables if not exist)
// sequelize.sync({ alter: true }).then(() => {
//   console.log('✅ Database & tables synced');
// });

export default app;
