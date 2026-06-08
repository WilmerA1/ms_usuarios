export function createAuthMiddleware(firebaseAuth) {
  return async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing token' });
    }
    try {
      const token = header.split(' ')[1];
      req.authUser = await firebaseAuth.verifyToken(token);
      next();
    } catch {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}