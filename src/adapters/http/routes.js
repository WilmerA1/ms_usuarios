import { createAuthMiddleware } from './authMiddleware.js';

export function createRoutes(userController, firebaseAuth) {
  const router = express.Router();
  const requireAuth = createAuthMiddleware(firebaseAuth);

  router.post('/register', (req, res) => userController.registerUser(req, res));
  

  router.get('/:id', requireAuth, (req, res) => userController.getUserById(req, res));
  router.post('/:id/reviews', requireAuth, (req, res) => userController.addReview(req, res));
  router.get('/:id/reviews', requireAuth, (req, res) => userController.getReviews(req, res));

  return router;
}