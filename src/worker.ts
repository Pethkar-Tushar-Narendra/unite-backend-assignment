import dotenv from 'dotenv';
import { connectMySQL } from './config/database';
import connectMongoDB from './config/mongodb';
import './config/redis';
import { startCSVWorker } from './workers/csvWorker';

dotenv.config();

const startWorker = async () => {
  try {
    await connectMySQL();
    await connectMongoDB();

    console.log('✅ Worker connected to databases');

    await startCSVWorker();
  } catch (error) {
    console.error('❌ Worker startup failed:', error);
    process.exit(1);
  }
};

startWorker();
