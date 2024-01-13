const authMiddleware = (req, res, next) => {
    // Your authentication logic
    next();
  };
  
  module.exports = authMiddleware;