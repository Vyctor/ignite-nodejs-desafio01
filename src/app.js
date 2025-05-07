import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { router } from "./infra/routes/index.js";

config();

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
app.use(router);

export { app };
