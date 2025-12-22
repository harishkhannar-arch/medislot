import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';

const router = Router();

router.post('/clinics', AdminController.createClinic);
router.get('/clinics', AdminController.listClinics);
router.post('/doctors', AdminController.createDoctor);
router.post('/slots', AdminController.createSlots);
router.get('/stats', AdminController.getStats);

export default router;
