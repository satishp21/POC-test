import { getRepository, LessThan } from "typeorm";
import { AppDataSource } from "../config/db";
import { Product } from "../models/product";

const productRepository = AppDataSource.getRepository(Product);

export const getAllProducts = async (filterData: any) => {
  const { category, name, minPrice, maxPrice } = filterData;
  let query = productRepository
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.category", "category");

  if (filterData.category)
    query = query.andWhere("category.id = :category", { category });
  if (name)
    query = query.andWhere("product.name LIKE :name", { name: `%${name}%` });
  if (minPrice)
    query = query.andWhere("product.price >= :minPrice", { minPrice });
  if (maxPrice)
    query = query.andWhere("product.price <= :maxPrice", { maxPrice });

  return await query.getMany();
};

export const getProductById = async (id: number) => {
  return productRepository.findOne({
    where: { id },
    relations: ["category"],
  });
};

export const createProduct = async (productData: Partial<Product>) => {
  const product = productRepository.create({
    ...productData,
    dateAdded: new Date(),
    lastUpdated: new Date(),
  });
  return productRepository.save(product);
};

export const updateProduct = async (
  id: number,
  productData: Partial<Product>
) => {
  productData.lastUpdated = new Date();
  await productRepository.update(id, productData);
  return getProductById(id);
};

export const deleteProduct = async (id: number) => {
  await productRepository.delete(id);
};

export const updateStock = async (id: number, quantity: number) => {
  const product = await getProductById(id);
  if (!product) throw new Error("Product not found");
  product.quantity += quantity;
  if (product.quantity < 0) throw new Error("Insufficient stock");
  product.lastUpdated = new Date();
  return productRepository.save(product);
};

export const getLowStockProducts = async (threshold: number) => {
  return productRepository.find({
    where: { quantity: LessThan(threshold) },
    relations: ["category"],
  });
};

export const getTotalStockValue = async () => {
  const productRepository = getRepository(Product);
  const result = await productRepository
    .createQueryBuilder("product")
    .select("SUM(product.price * product.quantity)", "total")
    .getRawOne();
  return result.total;
};

export const getOutOfStockProducts = async () => {
  const productRepository = getRepository(Product);
  return productRepository.find({
    where: { quantity: 0 },
    relations: ["category"],
  });
};

export const getCategoryWiseStock = async () => {
  const productRepository = getRepository(Product);
  return productRepository
    .createQueryBuilder("product")
    .select("category.name", "category")
    .addSelect("SUM(product.quantity)", "totalQuantity")
    .leftJoin("product.category", "category")
    .groupBy("category.name")
    .getRawMany();
};
