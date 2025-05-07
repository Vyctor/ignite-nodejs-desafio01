import { Router } from "express";
import { tasksRoutes } from "./tasks.routes.js";

const router = Router();

router.use("/api/v1/tasks", tasksRoutes);

export { router };
