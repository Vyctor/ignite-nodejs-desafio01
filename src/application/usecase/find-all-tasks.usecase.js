export class FindAllTasksUsecase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute() {
    const tasks = await this.taskRepository.findAll();
    return tasks;
  }
}
