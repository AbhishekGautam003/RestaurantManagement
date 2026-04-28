import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.id.startsWith('mock-')) {
        // Mock user
        req.user = {
          id: decoded.id,
          name: decoded.id === 'mock-admin' ? 'Admin User' : decoded.id === 'mock-staff' ? 'John Smith' : 'Jane Doe',
          email: decoded.id === 'mock-admin' ? 'admin@example.com' : decoded.id === 'mock-staff' ? 'staff@example.com' : 'customer@example.com',
          role: decoded.id === 'mock-admin' ? 'admin' : decoded.id === 'mock-staff' ? 'staff' : 'customer',
        };
      } else {
        req.user = await User.findById(decoded.id);

        if (!req.user) {
          return res.status(404).json({ message: 'User not found' });
        }
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `User role '${req.user.role}' is not authorized to access this route` });
    }
    next();
  };
};
