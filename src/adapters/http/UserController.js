export class UserController {
  constructor(userService) {
    this.userService = userService;
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

      const user = await this.userService.registerUser({ name, email, password, university });

      return res.status(201).json({
        message: 'User registered successfully',            
        user: user.toJSON ? user.toJSON() : user
      });
    } catch (error) {
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
}