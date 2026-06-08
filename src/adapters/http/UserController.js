export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  async registerUser(req, res) {
    const { name, email, password, university } = req.body;
    
    const fbUser = await this.firebaseAuth.createUser(email, password);
    
    const user = await this.userService.registerUser({
      firebaseUid: fbUser.uid, name, email, university
    });

    return res.status(201).json({ user: user.toJSON() });
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

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'email and password are required'
        });
      }

      if (typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'email must be a valid email address'
        });
      }

      if (typeof password !== 'string' || password === '') {
        return res.status(400).json({
          error: 'Validation error',
          message: 'password cannot be empty'
        });
      }

      const activeUser = await this.userService.loginUser({ email, password });

      return res.status(200).json({
        message: 'Login successful',
        user: activeUser
      });
    } catch (error) {
      if (error.message === 'Invalid email or password') {
        return res.status(401).json({
          error: 'Authentication error',
          message: 'Invalid email or password'
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