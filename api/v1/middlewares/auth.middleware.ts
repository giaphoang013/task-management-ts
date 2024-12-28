import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if(!req.headers.authorization) {
    res.json({
      code: 400,
      message: "Vui lòng gửi kèm token"
    });
    return;
  }

  const token: string = req.headers.authorization.split(" ")[1];

  const user = await User.findOne({
    token: token,
    deleted: false
  }).select("fullName email");

  if(!user) {
    res.json({
      code: 400,
      message: "Token không hợp lệ"
    });
    return;
  }

  res.locals.user = user;

  next();
}