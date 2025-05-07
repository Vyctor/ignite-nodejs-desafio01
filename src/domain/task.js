import { randomUUID } from "crypto";

class Task {
  id;
  title;
  description;
  createdAt;
  updatedAt;
  completedAt;

  constructor({ id, title, description, createdAt, updatedAt, completedAt }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.completedAt = completedAt;
  }

  static build({ title, description }) {
    return new Task({
      id: randomUUID(),
      title,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null,
    });
  }

  updateTitle(title) {
    this.title = title;
    this.updatedAt = new Date();
  }

  updateDescription(description) {
    this.description = description;
    this.updatedAt = new Date();
  }

  complete() {
    this.completedAt = new Date();
    this.updatedAt = new Date();
  }
}

export { Task };
