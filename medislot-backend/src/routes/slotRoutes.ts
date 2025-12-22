import { Router } from 'express';
import { slotController } from '../controllers/slotController';

const router = Router();

router.get('/', slotController.getSlotsByDoctor);
router.post('/', slotController.createSlot);
router.put('/:id', slotController.updateSlot);
router.delete('/:id', slotController.deleteSlot);

export default router;
