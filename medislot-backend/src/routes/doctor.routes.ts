import { Router } from 'express';
import { DoctorController } from '../controllers/doctor.controller';

const router = Router();

// Routes for getting data
router.get('/', DoctorController.listDoctors);
router.get('/:id', DoctorController.getDoctorDetail);
router.get('/:id/slots', DoctorController.getDoctorSlots);

// ✅ NEW ROUTE: Add this line to allow creating a doctor!
router.post('/', DoctorController.createDoctor);

export default router;