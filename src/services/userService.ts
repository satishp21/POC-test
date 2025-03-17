import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../config/db";
import { User } from "../models/user";

const userRepository = AppDataSource.getRepository(User);

export const login = async (username: string, password: string) => {
  const user = await userRepository.findOneBy({ username });
  if (user && user.password === password) {
    const token = jwt.sign(
      { id: user.id, role: user.role },
      "your_secret_key",
      { expiresIn: "1h" }
    );
    return { user, token };
  }
  throw new Error("Invalid credentials");
};

export const createUser = async (userData: Partial<User>) => {
  const user = userRepository.create(userData);
  return userRepository.save(user);
};
