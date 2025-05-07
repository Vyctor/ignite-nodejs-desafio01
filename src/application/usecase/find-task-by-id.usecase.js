export class FindTaskByIdUsecase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(id) {
    const task = await this.taskRepository.findById(id);
    return task;
  }
}
