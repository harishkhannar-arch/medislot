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
import doctorRoutes from './routes/doctor.routes';

const app = express();

// Middleware
// ✅ FIXED: Added your Vercel app to the allowed list
app.use(cors({
  origin: [
    config.server.frontendUrl,          // Allows localhost (for local testing)
    "https://medislot-ten.vercel.app"   // <--- THIS FIXES THE CORS ERROR
  ],
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
app.use('/appointments', appointmentRoutes);
app.use('/clinics', clinicRoutes);
app.use('/doctors', doctorRoutes); // ✅ Only listed once now
app.use('/slots', slotRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = config.server.port || 5000;
app.listen(PORT, () => {
  console.log('🚀 MediSlot Backend Server Started');
  console.log(`📌 Port: ${PORT}`);
  console.log(`🌐 Frontend URL: ${config.server.frontendUrl}`);
  console.log(`\n✅ Ready to receive requests!\n`);
});