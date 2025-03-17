import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export const authorizeRole = (role: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === role) next();
    else res.sendStatus(403);
  };
};
