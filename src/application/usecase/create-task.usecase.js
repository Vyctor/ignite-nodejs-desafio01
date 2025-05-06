import { Task } from "../../domain/task.js";

export class CreateTaskUsecase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(taskData) {
    if (!taskData.title || !taskData.description) {
      throw new Error("Title and description are required");
    }
    const task = Task.build({
      title: taskData.title,
      description: taskData.description,
    });
    return await this.taskRepository.create(task);
  }
}
