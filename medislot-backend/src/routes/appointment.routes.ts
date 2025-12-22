import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller';

const router = Router();

router.post('/', AppointmentController.bookAppointment);
router.get('/:id', AppointmentController.getAppointment);
router.get('/', AppointmentController.getPatientAppointments);
router.patch('/:id/cancel', AppointmentController.cancelAppointment);

export default router;
