import { Router } from "express";
import { login, createUser } from "../controllers/userController";
import { authenticateJWT, authorizeRole } from "../middleware/auth";

const userRouter = Router();

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User Login
 *     description: Authenticate a user and return a JWT token.
 *     tags:
 *       - User Auth
 *     parameters:
 *       - in: body
 *         name: userData
 *         description: User credentials for login.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               description: Username of the user
 *             password:
 *               type: string
 *               description: Password of the user
 *     responses:
 *       '200':
 *         description: User Login Successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized Access - Invalid credentials
 *       '500':
 *         description: Internal server error
 */
userRouter.post("/login", login);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: User Registration
 *     description: Register a new user. Requires admin authorization.
 *     tags:
 *       - User Auth
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: body
 *         name: userData
 *         description: Data required to register a new user.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               description: Username of the new user
 *             password:
 *               type: string
 *               description: Password of the new user
 *             role:
 *               type: string
 *               description: Role of the new user (e.g., 'admin' or 'user')
 *     responses:
 *       '201':
 *         description: User created successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized Access - Missing or invalid token
 *       '403':
 *         description: Forbidden - Insufficient permissions
 *       '500':
 *         description: Internal server error
 */
userRouter.post(
  "/register",
  authenticateJWT,
  authorizeRole("admin"),
  createUser
);

export default userRouter;
