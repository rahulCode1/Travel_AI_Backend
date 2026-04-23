import jwt from "jsonwebtoken";
import HttpError from "../model/error_model.js";

const authCheck = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return next(new HttpError("Token not found.", 401));
    }

    const decodedToken = jwt.decode(token, process.env.SECRET_KEY);
    req.userId = decodedToken.userId;

    next();
  } catch (error) {
    return next(
      new HttpError(`Authentication failed, Invalid or expired token`, 401),
    );
  }
};


export default authCheck;
