import { Request, Response } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getLowStockProducts,
  getTotalStockValue,
  getOutOfStockProducts,
  getCategoryWiseStock,
} from "../services/productService";

export const fetchAllProducts = async (req: Request, res: Response) => {
  const products = await getAllProducts(req.query);
  res.json(products);
};

export const fetchProductById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const product = await getProductById(id);
  if (product) res.json(product);
  else res.status(404).send("Product not found");
};

export const addProduct = async (req: Request, res: Response) => {
  const product = await createProduct(req.body);
  res.status(201).json(product);
};

export const editProduct = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const product = await updateProduct(id, req.body);
  if (product) res.json(product);
  else res.status(404).send("Product not found");
};

export const removeProduct = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await deleteProduct(id);
  res.status(204).send();
};

export const editStock = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { quantity } = req.body;
  const product = await updateStock(id, quantity);
  res.json(product);
};

export const fetchLowStock = async (req: Request, res: Response) => {
  const threshold = parseInt(req.query.threshold as string) || 10;
  const products = await getLowStockProducts(threshold);
  res.json(products);
};

export const getTotalStockValueHandler = async (
  req: Request,
  res: Response
) => {
  const total = await getTotalStockValue();
  res.json({ totalStockValue: total });
};

export const getOutOfStockHandler = async (req: Request, res: Response) => {
  const products = await getOutOfStockProducts();
  res.json(products);
};

export const getCategoryWiseStockHandler = async (
  req: Request,
  res: Response
) => {
  const stats = await getCategoryWiseStock();
  res.json(stats);
};

export const exportToCSV = async (req: Request, res: Response) => {
  const filterData = {
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  };

  const products = await getAllProducts(filterData);
  const createCsvWriter = require("csv-writer").createObjectCsvWriter;
  const csvWriter = createCsvWriter({
    path: "products.csv",
    header: [
      { id: "id", title: "ID" },
      { id: "name", title: "Name" },
      { id: "quantity", title: "Quantity" },
      { id: "price", title: "Price" },
    ],
  });
  await csvWriter.writeRecords(products);
  res.download("products.csv");
};
