import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/userRoutes";
import productRouter from "./routes/productRoutes";
import categoryRouter from "./routes/categoryRoutes";

import swaggerUi from "swagger-ui-express";
import specs from "./swagger-config";
import { AppDataSource } from "./config/db";

dotenv.config({ path: "./.env" });
const app: Express = express();

const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(userRouter);
app.use(productRouter);
app.use(categoryRouter);

const start = async () => {
  await AppDataSource.initialize();
  app.listen(port, async () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
};

start();
