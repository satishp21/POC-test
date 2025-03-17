import { AppDataSource } from "../config/db";
import { Category } from "../models/category";

const categoryRepository = AppDataSource.getRepository(Category);

export const getAllCategories = async () => {
  return categoryRepository.find();
};

export const getCategoryById = async (id: number) => {
  return categoryRepository.findOneBy({ id });
};

export const createCategory = async (categoryData: Partial<Category>) => {
  const category = categoryRepository.create(categoryData);
  return categoryRepository.save(category);
};

export const updateCategory = async (
  id: number,
  categoryData: Partial<Category>
) => {
  await categoryRepository.update(id, categoryData);
  return getCategoryById(id);
};

export const deleteCategory = async (id: number) => {
  await categoryRepository.delete(id);
};
