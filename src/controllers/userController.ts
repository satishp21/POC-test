import { Request, Response } from "express";
import {
  login as loginService,
  createUser as createUserService,
} from "../services/userService";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const result = await loginService(username, password);
  res.json(result);
};

export const createUser = async (req: Request, res: Response) => {
  const user = await createUserService(req.body);
  res.status(201).json(user);
};
