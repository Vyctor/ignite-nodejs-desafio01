export class UpdateTaskUsecase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute({ id, title, description }) {
    if (!id) {
      throw new Error("Id is required");
    }
    if (!title || !description) {
      throw new Error("Title and description are required");
    }
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error("Task not found");
    }
    task.updateTitle(title);
    task.updateDescription(description);
    return await this.taskRepository.update(task);
  }
}
