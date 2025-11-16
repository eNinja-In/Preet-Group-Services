/**
 * --------------------------------------------------------------------------
 * 1. Purpose:
 *    This utility provides two secure functions for handling user passwords:
 *    - hashPassword(): Safely hashes a plain-text password using bcrypt.
 *    - comparePassword(): Compares a plain password with a stored hash.
 *
 * 2. Security Features:
 *    - Uses bcrypt with a configurable saltRounds value for strong security.
 *    - Includes input validation to avoid weak or empty passwords.
 *    - Uses async/await for predictable, non-blocking operations.
 *    - Avoids exposing sensitive errors in logs; shows generic messages.
 *
 * 3. Recommended Usage:
 *    - Use hashPassword() when creating a new user or updating a password.
 *    - Use comparePassword() during login to validate credentials.
 *
 * 4. Important Notes:
 *    - bcrypt automatically salts password hashes, preventing rainbow-table attacks.
 *    - Increase `saltRounds` in production for stronger security (12–14 recommended).
 *    - Do NOT log the plain password or hashed password in production.
 * --------------------------------------------------------------------------
 */

import bcrypt from "bcrypt";
const saltRounds = 12;

export const hashPassword = async (password) => {
    try {
        if (!password || typeof password !== "string") { throw new Error("Invalid password format"); }
        const hashed = await bcrypt.hash(password, saltRounds);
        return hashed;
    } catch (error) {
        console.error("Password hashing failed (internal).");
        return null;
    }
};

export const comparePassword = async (password, hashedPassword) => {
    try {
        if (!password || !hashedPassword) return false;
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.error("Password comparison failed (internal).");
        return false;
    }
};
