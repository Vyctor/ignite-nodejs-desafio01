export class TaskRepository {
  static #instance = null;
  #tasks = [];

  constructor() {
    if (TaskRepository.#instance) {
      return TaskRepository.#instance;
    }
    this.tasks = [];
    TaskRepository.#instance = this;
  }

  static getInstance() {
    if (!TaskRepository.#instance) {
      TaskRepository.#instance = new TaskRepository();
    }
    return TaskRepository.#instance;
  }

  async findAll() {
    return this.#tasks;
  }

  async findById(id) {
    return this.#tasks.find((task) => task.id === id);
  }

  async create(task) {
    this.#tasks.push(task);
    return task;
  }

  async update(id, task) {
    const index = this.#tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      return null;
    }
    this.#tasks[index] = task;
    return this.#tasks[index];
  }

  async delete(id) {
    const index = this.#tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      return null;
    }
    const deletedTask = this.#tasks[index];
    this.#tasks.splice(index, 1);
    return deletedTask;
  }
}
