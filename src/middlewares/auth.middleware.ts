import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { errorResponse } from "../utils/responseHandler";

// Extend Request type to include `user`
declare module "express-serve-static-core" {
    interface Request {
        user?: JwtPayload & { role: string };
    }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    if (req.method !== "POST") {
        return next(); // Skip if not a POST request
    }

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json(errorResponse("Access denied", "Access denied, token missing!"));
        return;
    }

    try {
        const decoded: string | JwtPayload = jwt.verify(token, JWT_SECRET as string);

        // Explicitly check if the token is expired
        // Ensure decoded is an object before checking expiration
        if (typeof decoded === "object" && "exp" in decoded) {
            if (decoded.exp! * 1000 < Date.now()) {
                res.status(403).json(errorResponse("Token expired", "Token expired! Please log in again."));
                return;
            }
        }

        req.user = decoded as JwtPayload & { role: string }; // Type assertion// Attach decoded user info to request
        next();
    } catch (err) {
        res.status(403).json(errorResponse("Invalid token!", err));
        return;
    }
};

export default authenticateToken;
