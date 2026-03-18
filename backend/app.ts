import express from "express";
import cors from "cors";
import path from "path";
import { errorHandler } from "./apps/middleware/errorHandler";
import { env } from "./Config/env";
import controller from "./apps/controllers/index";

// Define basedir globally like in 22dtha123
(global as any).__basedir = __dirname;

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files (if any)
app.use("/static", express.static(path.join(__dirname, "public")));

// Use centralized controller/router
app.use("/api", controller);

app.use(errorHandler);

export default app;
