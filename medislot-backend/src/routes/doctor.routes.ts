import { Router } from 'express';
import { DoctorController } from '../controllers/doctor.controller';

const router = Router();

router.get('/', DoctorController.listDoctors);
router.get('/:id', DoctorController.getDoctorDetail);
router.get('/:id/slots', DoctorController.getDoctorSlots);

export default router;
