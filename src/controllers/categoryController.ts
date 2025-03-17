import { Request, Response } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

export const getAllCategoriesHandler = async (req: Request, res: Response) => {
  const categories = await getAllCategories();
  res.json(categories);
};

export const getCategoryByIdHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const category = await getCategoryById(id);
  if (category) res.json(category);
  else res.status(404).send("Category not found");
};

export const createCategoryHandler = async (req: Request, res: Response) => {
  const category = await createCategory(req.body);
  res.status(201).json(category);
};

export const updateCategoryHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const category = await updateCategory(id, req.body);
  if (category) res.json(category);
  else res.status(404).send("Category not found");
};

export const deleteCategoryHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await deleteCategory(id);
  res.status(204).send();
};
