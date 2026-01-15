import { Router } from 'express';
import { WishlistController } from '../controllers/wishlistController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import {
  addToWishlistSchema,
  updateWishlistSchema,
  wishlistQuerySchema,
} from '../validators/wishlistValidator';

const router = Router();
const controller = new WishlistController();

// All routes require authentication
router.use(authenticate);

// Get user's wishlist
router.get(
  '/',
  validateRequest({ query: wishlistQuerySchema }),
  controller.getWishlist.bind(controller)
);

// Get wishlist count
router.get('/count', controller.getWishlistCount.bind(controller));

// Add to wishlist
router.post(
  '/',
  validateRequest({ body: addToWishlistSchema }),
  controller.addToWishlist.bind(controller)
);

// Update wishlist item
router.patch(
  '/:dealId',
  validateRequest({ body: updateWishlistSchema }),
  controller.updateWishlist.bind(controller)
);

// Remove from wishlist
router.delete('/:dealId', controller.removeFromWishlist.bind(controller));

export default router;
