import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new AuthController();

// Public routes
router.post('/register', controller.register.bind(controller));
router.post('/login', controller.login.bind(controller));

// Protected routes
router.get('/me', authenticate, controller.me.bind(controller));

export default router;
