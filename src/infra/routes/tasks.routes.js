import { Router } from "express";
import { config } from "dotenv";
import multer from "multer";
import { FindAllTasksUsecase } from "../../application/usecase/find-all-tasks.usecase.js";
import { CreateTaskUsecase } from "../../application/usecase/create-task.usecase.js";
import { CompleteTaskUsecase } from "../../application/usecase/complete-task.usecase.js";
import { UpdateTaskUsecase } from "../../application/usecase/update-task.usecase.js";
import { DeleteTaskUsecase } from "../../application/usecase/delete-task.usecase.js";
import { ImportTasksFromCsvUsecase } from "../../application/usecase/import-tasks-from-csv.usecase.js";
import csvParser from "csv-parser";
import fs from "fs";
import { MongoClient } from "../../infra/database/mongo-client.js";
import { FindTaskByIdUsecase } from "../../application/usecase/find-task-by-id.usecase.js";
import { RedisClient } from "../../infra/cache/redis-client.js";
import { TaskRepository } from "../database/repositories/task.repository.js";
import { TasksController } from "../../infra/controllers/tasks.controller.js";

config();

const tasksRoutes = Router();

const upload = multer({ dest: "uploads/" });
const uploadMiddleware = upload.single("file");

const mongoClient = new MongoClient();
const redisClient = new RedisClient();
const taskRepository = new TaskRepository(mongoClient, redisClient);
const findTaskByIdUsecase = new FindTaskByIdUsecase(taskRepository);
const findAllTasksUsecase = new FindAllTasksUsecase(taskRepository);
const createTaskUsecase = new CreateTaskUsecase(taskRepository);
const updateTaskUsecase = new UpdateTaskUsecase(taskRepository);
const completeTaskUsecase = new CompleteTaskUsecase(taskRepository);
const deleteTaskUsecase = new DeleteTaskUsecase(taskRepository);
const importTasksFromCsvUsecase = new ImportTasksFromCsvUsecase(
  taskRepository,
  csvParser,
  fs
);

const tasksController = new TasksController({
  findAllTasksUsecase,
  findTaskByIdUsecase,
  createTaskUsecase,
  updateTaskUsecase,
  completeTaskUsecase,
  deleteTaskUsecase,
  importTasksFromCsvUsecase,
});

tasksRoutes.get("/", tasksController.findAll.bind(tasksController));
tasksRoutes.get("/:id", tasksController.findById.bind(tasksController));
tasksRoutes.post("/", tasksController.create.bind(tasksController));
tasksRoutes.put("/:id", tasksController.update.bind(tasksController));
tasksRoutes.delete("/:id", tasksController.delete.bind(tasksController));
tasksRoutes.patch(
  "/:id/complete",
  tasksController.complete.bind(tasksController)
);
tasksRoutes.post(
  "/import",
  uploadMiddleware,
  tasksController.importFromCsv.bind(tasksController)
);

export { tasksRoutes };
