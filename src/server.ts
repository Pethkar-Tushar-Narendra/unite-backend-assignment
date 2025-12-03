import { connectMySQL } from './config/database';
import connectMongoDB from './config/mongodb';
import './config/redis';
import sequelize from './config/database'; // Import sequelize instance for syncing
import config from './config/config';
import CallTask from './models/callTask.model';
import User from './models/user.model';
import Lead from './models/lead.model';
import 'dotenv/config';

const startServer = async () => {
  try {
    // 1. Connect to MySQL (Create DB if missing)
    await connectMySQL();

    // 2. Connect to MongoDB
    await connectMongoDB();

    // 3. Sync models ONE BY ONE in order
    console.log('⏳ Syncing User model...');
    await User
      .sync
      // { alter: true }
      ();
    console.log('✅ User model synced');

    console.log('⏳ Syncing Lead model...');
    await Lead.sync({ alter: true });
    console.log('✅ Lead model synced');

    console.log('⏳ Syncing CallTask model...');
    await CallTask.sync({ alter: true });
    console.log('✅ CallTask model synced');

    // 3. Sync Sequelize Models (Create tables) - THIS WAS MISSING
    // { alter: true } updates tables if columns change without dropping data
    await sequelize
      .sync
      // { alter: true }
      ();
    console.log('✅ Database & tables synced');

    // 4. NOW import the app (which loads models)
    const app = (await import('./app')).default;

    const PORT = config.port || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
