import app from './app';
import config from './config/config';
import { connectMySQL } from './config/database';
import connectMongoDB from './config/mongodb';
import './config/redis'; // Initializes Redis event listeners

const PORT = config.port || 3000;

const startServer = async () => {
  // 1. Connect to Databases
  await connectMySQL();
  await connectMongoDB();

  // 2. Start Express Server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
