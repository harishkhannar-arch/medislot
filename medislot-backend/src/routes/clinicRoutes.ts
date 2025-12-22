import { Router } from 'express';
import { clinicController } from '../controllers/clinicController';

const router = Router();

router.get('/', clinicController.getAllClinics);
router.get('/:id', clinicController.getClinicById);
router.post('/', clinicController.createClinic);
router.put('/:id', clinicController.updateClinic);
router.delete('/:id', clinicController.deleteClinic);

export default router;
