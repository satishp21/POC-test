import { Router } from "express";
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getCategoryByIdHandler,
  updateCategoryHandler,
} from "../controllers/categoryController";
import { authenticateJWT, authorizeRole } from "../middleware/auth";
import { getAllCategories } from "../services/categoryService";

const categoryRouter = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get All Categories
 *     description: Retrieve a list of all categories.
 *     tags:
 *       - Categories
 *     responses:
 *       '200':
 *         description: A list of categories retrieved successfully
 *       '500':
 *         description: Internal server error
 */
categoryRouter.get("/", getAllCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get Category by ID
 *     description: Retrieve a category by its ID.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the category to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Category retrieved successfully
 *       '404':
 *         description: Category not found
 *       '500':
 *         description: Internal server error
 */
categoryRouter.get("/:id", getCategoryByIdHandler);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a New Category
 *     description: Create a new category. Requires admin authorization.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: body
 *         name: categoryData
 *         description: Data for the new category.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Name of the category
 *     responses:
 *       '201':
 *         description: Category created successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized Access - Missing or invalid token
 *       '403':
 *         description: Forbidden - Insufficient permissions
 *       '500':
 *         description: Internal server error
 */
categoryRouter.post(
  "/",
  authenticateJWT,
  authorizeRole("admin"),
  createCategoryHandler
);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a Category
 *     description: Update an existing category. Requires admin authorization.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the category to update
 *         required: true
 *         schema:
 *           type: integer
 *       - in: body
 *         name: categoryData
 *         description: Updated data for the category.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: New name of the category
 *     responses:
 *       '200':
 *         description: Category updated successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized Access - Missing or invalid token
 *       '403':
 *         description: Forbidden - Insufficient permissions
 *       '404':
 *         description: Category not found
 *       '500':
 *         description: Internal server error
 */
categoryRouter.put(
  "/:id",
  authenticateJWT,
  authorizeRole("admin"),
  updateCategoryHandler
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a Category
 *     description: Delete an existing category. Requires admin authorization.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the category to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Category deleted successfully
 *       '401':
 *         description: Unauthorized Access - Missing or invalid token
 *       '403':
 *         description: Forbidden - Insufficient permissions
 *       '404':
 *         description: Category not found
 *       '500':
 *         description: Internal server error
 */
categoryRouter.delete(
  "/:id",
  authenticateJWT,
  authorizeRole("admin"),
  deleteCategoryHandler
);

export default categoryRouter;
