import { Router } from "express";
import {
  fetchAllProducts,
  fetchLowStock,
  fetchProductById,
  addProduct,
  editProduct,
  editStock,
  removeProduct,
  getTotalStockValueHandler,
  getOutOfStockHandler,
  getCategoryWiseStockHandler,
  exportToCSV,
} from "../controllers/productController";
import { authenticateJWT, authorizeRole } from "../middleware/auth";

const productRouter = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get All Products
 *     description: Retrieve a list of products with optional filters.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: category
 *         description: Filter by category ID
 *         schema:
 *           type: integer
 *       - in: query
 *         name: name
 *         description: Filter by product name (partial match)
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         description: Filter by minimum price
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         description: Filter by maximum price
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: A list of products retrieved successfully
 *       '500':
 *         description: Internal server error
 */
productRouter.get("/", fetchAllProducts);

/**
 * @swagger
 * /products/low-stock:
 *   get:
 *     summary: Get Low Stock Products
 *     description: Retrieve products with quantity below a threshold.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: threshold
 *         description: The stock threshold (default: 10)
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: A list of low stock products retrieved successfully
 *       '500':
 *         description: Internal server error
 */
productRouter.get("/low-stock", fetchLowStock);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get Product by ID
 *     description: Retrieve a product by its ID.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Product retrieved successfully
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Internal server error
 */
productRouter.get("/:id", fetchProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a New Product
 *     description: Create a new product. Requires admin authorization.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: body
 *         name: productData
 *         description: Data for the new product.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Name of the product
 *             description:
 *               type: string
 *               description: Description of the product
 *             categoryId:
 *               type: integer
 *               description: ID of the category
 *             quantity:
 *               type: integer
 *               description: Stock quantity
 *             price:
 *               type: number
 *               description: Price of the product
 *             supplierInfo:
 *               type: string
 *               description: Supplier information
 *     responses:
 *       '201':
 *         description: Product created successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized Access - Missing or invalid token
 *       '403':
 *         description: Forbidden - Insufficient permissions
 *       '500':
 *         description: Internal server error
 */
productRouter.post("/", authenticateJWT, authorizeRole("admin"), addProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a Product
 *     description: Update an existing product. Requires admin authorization.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to update
 *         required: true
 *         schema:
 *           type: integer
 *       - in: body
 *         name: productData
 *         description: Updated data for the product.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: New name of the product
 *             description:
 *               type: string
 *               description: New description
 *             categoryId:
 *               type: integer
 *               description: New category ID
 *             price:
 *               type: number
 *               description: New price
 *             supplierInfo:
 *               type: string
 *               description: New supplier information
 *     responses:
 *       '200':
 *         description: Product updated successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized Access - Missing or invalid token
 *       '403':
 *         description: Forbidden - Insufficient permissions
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Internal server error
 */
productRouter.put("/:id", authenticateJWT, editProduct);

/**
 * @swagger
 * /products/{id}/stock:
 *   put:
 *     summary: Update Product Stock
 *     description: Update the stock quantity of a product. Requires authentication.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to update stock
 *         required: true
 *         schema:
 *           type: integer
 *       - in: body
 *         name: stockData
 *         description: Stock quantity to update.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             quantity:
 *               type: integer
 *               description: Quantity to add (can be negative to subtract)
 *     responses:
 *       '200':
 *         description: Stock updated successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized Access - Missing or invalid token
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Internal server error
 */
productRouter.put("/:id/stock", authenticateJWT, editStock);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a Product
 *     description: Delete an existing product. Requires admin authorization.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Product deleted successfully
 *       '401':
 *         description: Unauthorized Access - Missing or invalid token
 *       '403':
 *         description: Forbidden - Insufficient permissions
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Internal server error
 */
productRouter.delete(
  "/:id",
  authenticateJWT,
  authorizeRole("admin"),
  removeProduct
);

/**
 * @swagger
 * /reports/total-stock-value:
 *   get:
 *     summary: Get Total Stock Value
 *     description: Calculate the total value of all products in stock. Requires authentication.
 *     tags:
 *       - Reports
 *     responses:
 *       '200':
 *         description: Total stock value retrieved successfully
 *       '401':
 *         description: Unauthorized Access - Missing or invalid token
 *       '500':
 *         description: Internal server error
 */
productRouter.get("/reports/total-stock-value", getTotalStockValueHandler);
/**
 * @swagger
 * /reports/out-of-stock:
 *   get:
 *     summary: Get Out of Stock Products
 *     description: Retrieve a list of products that are out of stock. Requires authentication.
 *     tags:
 *       - Reports
 *     responses:
 *       '200':
 *         description: A list of out of stock products retrieved successfully
 *       '401':
 *         description: Unauthorized Access - Missing or invalid token
 *       '500':
 *         description: Internal server error
 */
productRouter.get("/reports/out-of-stock", getOutOfStockHandler);

/**
 * @swagger
 * /reports/category-wise:
 *   get:
 *     summary: Get Category-Wise Stock Distribution
 *     description: Retrieve stock distribution by category. Requires authentication.
 *     tags:
 *       - Reports
 *     responses:
 *       '200':
 *         description: Category-wise stock distribution retrieved successfully
 *       '401':
 *         description: Unauthorized Access - Missing or invalid token
 *       '500':
 *         description: Internal server error
 */
productRouter.get("/reports/category-wise", getCategoryWiseStockHandler);

/**
 * @swagger
 * /export/csv:
 *   get:
 *     summary: Export Products to CSV
 *     description: Export all product data to a CSV file. Requires admin authorization.
 *     tags:
 *       - Export
 *     responses:
 *       '200':
 *         description: CSV file exported successfully
 *       '401':
 *         description: Unauthorized Access - Missing or invalid token
 *       '403':
 *         description: Forbidden - Insufficient permissions
 *       '500':
 *         description: Internal server error
 */
productRouter.get("/export/csv", exportToCSV);

export default productRouter;
