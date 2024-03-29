import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const protectRoute = async (req, res, next) => {
  try {
    // Fetch token, get userid from payload, find user by id, and attach user to req object
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
    console.log('Error in protectRoute: ', error.message);
  }
};

export default protectRoute;
