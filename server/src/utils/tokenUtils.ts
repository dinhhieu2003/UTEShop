import jwt from "jsonwebtoken";

export const extractToken = (authHeader: string | undefined): string | null => {
    if (!authHeader) return null;
    const tokenParts = authHeader.split(" ");
    return tokenParts.length === 2 ? tokenParts[1] : null;
};

// Middleware to verify the JWT and decode it
export const verifyToken = (token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded);
        });
    });
};