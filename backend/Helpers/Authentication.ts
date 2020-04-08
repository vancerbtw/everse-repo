import pg from "../Database/pg";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction} from "express";

export default async function verify(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return res.status(400).json({
      success: false,
      error: "Missing Authorization Header"
    });
  }
  
  if (req.headers.authorization.split(" ")[0] !== "Bearer" || req.headers.authorization.split(" ").length !== 2) {
    return res.status(400).json({
      success: false,
      error: "Invalid Authorization Header Format, Please use 'Bearer {token}' format."
    });
  }

  const token = req.headers.authorization.split(" ")[1]

  try {
    const decoded: { user_id?: string } = jwt.verify(token, process.env.JWT_SECRET || "") as {  user_id?: string  }; 
    const user = await pg("accounts").where({id: parseInt(decoded.user_id!) || "" }).first();
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid Token"
      });
    }

    if (user.disabled) {
      return res.status(400).json({
        success: false,
        error: "User is disabled"
      });
    }
    
    req.user = {
      name: user.username,
      email: user.email,
      developer: user.developer,
      verified: user.verified,
      disabled: user.disabled,
      id: user.id
    }

    next();
  } catch {
    return res.status(400).json({
      success: false,
      error: "Error decoding token"
    });
  }
}