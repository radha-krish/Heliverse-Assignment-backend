
const roleAccess = (requiredRole) => {
  return (req, res, next) => {
    // Check if the user is authenticated and has the 'Manager' role
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
    }
    next(); // Proceed to the next middleware or route handler if the role matches
  };
};

module.exports = roleAccess;
