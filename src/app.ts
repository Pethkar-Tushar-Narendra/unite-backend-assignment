import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth.routes';
import itemRoutes from './routes/itemRoutes';
import userRoutes from './routes/user.routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

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
