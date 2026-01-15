import { Router } from 'express';
import { DealsController } from '../controllers/dealsController';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new DealsController();

// Public routes (anyone can view deals)
router.get('/', controller.getAllDeals.bind(controller));
router.get('/:id', controller.getDealById.bind(controller));

// Protected routes (admin only for creating deals)
router.post('/', authenticate, controller.createDeal.bind(controller));

export default router;
