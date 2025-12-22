import dotenv from 'dotenv';

dotenv.config();

export const config = {
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/medislot_db',
  },
  server: {
    port: parseInt(process.env.PORT || '5000'),
    env: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
};

console.log('✅ Configuration loaded');
console.log(`📊 Database: ${config.database.url.split('@')}`);
console.log(`🌐 Frontend URL: ${config.server.frontendUrl}`);
