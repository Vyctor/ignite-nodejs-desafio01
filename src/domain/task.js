import { randomUUID } from "crypto";

class Task {
  #id;
  #title;
  #description;
  #createdAt;
  #updatedAt;
  #completedAt;

  constructor({ id, title, description, createdAt, updatedAt, completedAt }) {
    this.#id = id;
    this.#title = title;
    this.#description = description;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
    this.#completedAt = completedAt;
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

  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }

  get description() {
    return this.#description;
  }

  get createdAt() {
    return this.#createdAt;
  }

  get updatedAt() {
    return this.#updatedAt;
  }

  get completedAt() {
    return this.#completedAt;
  }

  set title(title) {
    this.#title = title;
    this.#updatedAt = new Date();
  }

  set description(description) {
    this.#description = description;
    this.#updatedAt = new Date();
  }

  set completedAt(completedAt) {
    this.#completedAt = completedAt;
    this.#updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.#id,
      title: this.#title,
      description: this.#description,
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
      completedAt: this.#completedAt,
    };
  }
}

export { Task };
