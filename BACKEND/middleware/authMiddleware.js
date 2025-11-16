/**
 * -----------------------------------------------------------------------------
 * 1. Purpose:
 *    This middleware protects private routes by verifying a valid JWT token.
 *    It ensures only authenticated users can access protected API endpoints.
 *
 * 2. Security Features:
 *    - Extracts token from Authorization header in standard "Bearer <token>" form.
 *    - Uses JWT.verify() to validate token integrity and expiration.
 *    - Sanitizes error messages to avoid leaking sensitive server info.
 *    - Handles all major JWT errors (expired, malformed, missing).
 *    - Attaches the decoded user payload to req.user for downstream controllers.
 *
 * 3. Expected Client Behavior:
 *    The client must send the token in the request header:
 *       Authorization: Bearer <jwt_token>
 *
 * 4. Important Notes:
 *    - JSON_SECRET_KEY must be kept strictly private (use env variables).
 *    - Do NOT include passwords or sensitive data inside the JWT payload.
 *    - Tokens should have short expirations (15m–1h recommended).
 * -----------------------------------------------------------------------------
 */

import JWT from "jsonwebtoken";

export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) { return res.status(401).json({ success: false, message: "Unauthorized: Token missing", }); }

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    if (!token) { return res.status(401).json({ success: false, message: "Unauthorized: Token invalid or missing", }); }

    const decoded = JWT.verify(token, process.env.JSON_SECRET_KEY);
    req.user = decoded; // Attach user payload to request

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") { return res.status(401).json({ success: false, message: "Session expired. Please log in again.", }); }

    if (error.name === "JsonWebTokenError") { return res.status(401).json({ success: false, message: "Invalid authentication token.", }); }

    console.error("JWT Error:", error.message);
    return res.status(500).json({ success: false, message: "Authentication failed due to a server error.", });
  }
};
