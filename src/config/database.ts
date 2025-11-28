import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise'; // Import mysql2 promise wrapper
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DB_NAME || 'unite_db';
const dbUser = process.env.DB_USER || 'admin';
const dbPass = process.env.DB_PASS || 'password';
const dbHost = process.env.DB_HOST || 'localhost';

// Function to create DB if it doesn't exist
const initializeDatabase = async () => {
  try {
    // Connect to MySQL server WITHOUT specifying a database
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPass,
    });

    // Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`✅ Database "${dbName}" checked/created successfully.`);
    await connection.end();
  } catch (error) {
    console.error('❌ Error creating database:', error);
    process.exit(1);
  }
};

// Initialize Sequelize (will be exported)
const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  dialect: 'mysql',
  logging: false,
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
});

export const connectMySQL = async () => {
  await initializeDatabase(); // Run the check first
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the MySQL database:', error);
    process.exit(1);
  }
};

export default sequelize;
