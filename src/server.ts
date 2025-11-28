import { connectMySQL } from './config/database';
import connectMongoDB from './config/mongodb';
import './config/redis';
import sequelize from './config/database'; // Import sequelize instance for syncing

const startServer = async () => {
  try {
    // 1. Connect to MySQL (Create DB if missing)
    await connectMySQL();

    // 2. Connect to MongoDB
    await connectMongoDB();

    // 3. Sync Sequelize Models (Create tables) - THIS WAS MISSING
    // { alter: true } updates tables if columns change without dropping data
    await sequelize.sync({ alter: true });
    console.log('✅ Database & tables synced');

    // 4. NOW import the app (which loads models)
    const app = (await import('./app')).default;

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
