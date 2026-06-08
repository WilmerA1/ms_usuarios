export class UserController {
  constructor(userService, firebaseAuth) {
    this.userService = userService;
    this.firebaseAuth = firebaseAuth;
  }

  async registerUser(req, res) {
    try {
      const { name, email, password, university } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'name, email and password are required'
        });
      }

      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({
          error: 'Validation error',
          message: 'name must be a non-empty string'
        });
      }

      if (typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'email must be a valid email address'
        });
      }

      if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'password must be at least 6 characters'
        });
      }

      // 1. Crear usuario en Firebase Auth
      const fbUser = await this.firebaseAuth.createUser(email, password);

      // 2. Crear perfil en la base de datos usando el uid de Firebase
      const user = await this.userService.registerUser({
        firebaseUid: fbUser.uid,
        name,
        email,
        university
      });

      return res.status(201).json({
        message: 'User registered successfully',
        user: user.toJSON ? user.toJSON() : user
      });
    } catch (error) {
      // Firebase lanza este código si el email ya existe
      if (error.code === 'auth/email-already-exists') {
        return res.status(409).json({
          error: 'Conflict',
          message: 'Email is already registered'
        });
      }
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string' || id.trim() === '') {
        return res.status(400).json({
          error: 'Validation error',
          message: 'User id is required'
        });
      }

      const user = await this.userService.getUserById(id.trim());

      return res.status(200).json({
        message: 'User retrieved successfully',
        user
      });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({
          error: 'Not found',
          message: `No user exists with id '${req.params.id}'`
        });
      }
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }

  // ── Reviews ─────────────────────────────────────────────────────────────────

  async addReview(req, res) {
    try {
      const { id } = req.params;
      const { reviewerName, text, stars } = req.body;

      if (!id || typeof id !== 'string' || id.trim() === '') {
        return res.status(400).json({
          error: 'Validation error',
          message: 'User id is required'
        });
      }

      if (!stars || isNaN(parseInt(stars))) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'stars is required and must be a number'
        });
      }

      const review = await this.userService.addReview(id.trim(), { reviewerName, text, stars });

      return res.status(201).json({
        message: 'Review created successfully',
        review
      });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({
          error: 'Not found',
          message: `No user exists with id '${req.params.id}'`
        });
      }
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }

  async getReviews(req, res) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string' || id.trim() === '') {
        return res.status(400).json({
          error: 'Validation error',
          message: 'User id is required'
        });
      }

      const reviews = await this.userService.getReviews(id.trim());

      return res.status(200).json({
        message: 'Reviews retrieved successfully',
        reviews
      });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({
          error: 'Not found',
          message: `No user exists with id '${req.params.id}'`
        });
      }
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
}
