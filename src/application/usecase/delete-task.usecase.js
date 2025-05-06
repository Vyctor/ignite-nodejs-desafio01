export class DeleteTaskUsecase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(taskId) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    await this.taskRepository.delete(taskId);
  }
}
