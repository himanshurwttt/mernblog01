import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyUser = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized 01"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized 02"));
    }
    req.user = decoded;
    next();
  });
};
