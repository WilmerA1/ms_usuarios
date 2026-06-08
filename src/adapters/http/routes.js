import express from 'express';

export function createRoutes(userController) {
  const router = express.Router();
  
  router.post('/register', (req, res) => userController.registerUser(req, res));
  router.post('/login', (req, res) => userController.loginUser(req, res));
  router.get('/:id', (req, res) => userController.getUserById(req, res));

  // Reviews
  router.post('/:id/reviews', (req, res) => userController.addReview(req, res));
  router.get('/:id/reviews', (req, res) => userController.getReviews(req, res));

  return router;
}