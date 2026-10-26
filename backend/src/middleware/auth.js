import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { sendError } from '../utils/apiResponse.js';

/**
 * Authentication Middleware for Admin Endpoints
 * Supports both secure HttpOnly cookies (browser) and Bearer headers (API/CLI)
 */
export async function authenticateAdmin(req, res, next) {
  try {
    let token = null;

    // 1. Check HttpOnly cookie
    if (req.cookies && req.cookies.admin_token) {
      token = req.cookies.admin_token;
    }

    // 2. Fallback to Bearer token in Authorization header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(
        res,
        'Access denied. Authentication token missing. Please log in as admin.',
        401,
        null,
        'UNAUTHORIZED'
      );
    }

    // 3. Verify JWT signature and expiration
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (jwtErr) {
      return sendError(
        res,
        'Session expired or invalid token. Please log in again.',
        401,
        null,
        jwtErr.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID'
      );
    }

    // 4. Verify admin exists in MongoDB
    const admin = await Admin.findById(decoded.id).select('-passwordHash');
    if (!admin) {
      return sendError(
        res,
        'The administrative account associated with this session no longer exists.',
        401,
        null,
        'ACCOUNT_NOT_FOUND'
      );
    }

    // Attach verified admin entity to request context
    req.admin = admin;
    next();
  } catch (err) {
    console.error(`[AuthMiddleware] Verification error: ${err.message}`);
    return sendError(
      res,
      'Internal authentication error.',
      500,
      null,
      'AUTH_INTERNAL_ERROR'
    );
  }
}

export default authenticateAdmin;
