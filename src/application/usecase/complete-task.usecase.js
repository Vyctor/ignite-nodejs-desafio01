export class CompleteTaskUsecase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute({ id }) {
    if (!id) {
      throw new Error("Id is required");
    }
    const task = await this.taskRepository.findById(id);
    console.log("task from usecase", task);
    if (!task) {
      throw new Error("Task not found");
    }
    if (task.completedAt) {
      throw new Error("Task already completed");
    }
    task.complete();
    return await this.taskRepository.update(task);
  }
}
