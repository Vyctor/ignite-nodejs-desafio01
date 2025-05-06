import express from "express";
import multer from "multer";
import { config } from "dotenv";
import cors from "cors";
import { TaskRepository } from "./infra/database/repositories/task.repository.js";
import { FindAllTasksUsecase } from "./application/usecase/find-all-tasks.usecase.js";
import { CreateTaskUsecase } from "./application/usecase/create-task.usecase.js";
import { CompleteTaskUsecase } from "./application/usecase/complete-task.usecase.js";
import { UpdateTaskUsecase } from "./application/usecase/update-task.usecase.js";
import { DeleteTaskUsecase } from "./application/usecase/delete-task.usecase.js";
import { ImportTasksFromCsvUsecase } from "./application/usecase/import-tasks-from-csv.usecase.js";
import csvParser from "csv-parser";
import fs from "fs";

config();

const tasks = [];
const upload = multer({ dest: "uploads/" });
const uploadMiddleware = upload.single("file");

const APP_PORT = process.env.APP_PORT || 4001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const taskRepository = TaskRepository.getInstance();
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

app.get("/api/v1/tasks", async (req, res) => {
  const tasks = await findAllTasksUsecase.execute();
  return res.status(200).json({
    tasks,
  });
});

app.post("/api/v1/tasks", async (req, res) => {
  const { title, description } = req.body;
  const task = await createTaskUsecase.execute({ title, description });
  res.status(201).json({
    task,
  });
});

app.put("/api/v1/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const task = await updateTaskUsecase.execute({
    id,
    title,
    description,
  });
  res.status(200).json({
    data: {
      task,
    },
  });
});

app.delete("/api/v1/tasks/:id", async (req, res) => {
  const { id } = req.params;
  await deleteTaskUsecase.execute(id);
  res.status(204).json();
});

app.patch("/api/v1/tasks/:id/complete", async (req, res) => {
  const { id } = req.params;
  const task = await completeTaskUsecase.execute({
    id,
  });
  res.status(200).json({
    data: {
      task,
    },
  });
});

app.post("/api/v1/tasks/import", uploadMiddleware, async (req, res) => {
  const filePath = req.file.path;
  const data = await importTasksFromCsvUsecase.execute(filePath);
  res.status(201).json({
    data: {
      tasks: data,
    },
  });
});

app.listen(APP_PORT, () => {
  console.log("Server is running on port ", APP_PORT);
});
