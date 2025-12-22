import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/environment';
import { initializeDatabase } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Import routes
import adminRoutes from './routes/admin.routes';
import appointmentRoutes from './routes/appointment.routes';
import clinicRoutes from './routes/clinicRoutes';
import slotRoutes from './routes/slotRoutes';
import doctorRoutes from './routes/doctor.routes'; // existing



const app = express();

// Middleware
app.use(cors({
  origin: config.server.frontendUrl,
  credentials: true,
}));
app.use(express.json());

// Initialize database
initializeDatabase().catch(console.error);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'MediSlot Backend is running' });
});

// Routes
app.use('/admin', adminRoutes);
app.use('/doctors', doctorRoutes);
app.use('/appointments', appointmentRoutes);

app.use('/clinics', clinicRoutes);
app.use('/doctors', doctorRoutes);
app.use('/slots', slotRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log('🚀 MediSlot Backend Server Started');
  console.log(`📌 Port: ${PORT}`);
  console.log(`🌐 Frontend URL: ${config.server.frontendUrl}`);
  console.log(`\n✅ Ready to receive requests!\n`);
});
