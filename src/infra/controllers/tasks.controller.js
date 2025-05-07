class TasksController {
  constructor({
    findAllTasksUsecase,
    findTaskByIdUsecase,
    createTaskUsecase,
    updateTaskUsecase,
    completeTaskUsecase,
    deleteTaskUsecase,
    importTasksFromCsvUsecase,
  }) {
    this.findAllTasksUsecase = findAllTasksUsecase;
    this.findTaskByIdUsecase = findTaskByIdUsecase;
    this.createTaskUsecase = createTaskUsecase;
    this.updateTaskUsecase = updateTaskUsecase;
    this.completeTaskUsecase = completeTaskUsecase;
    this.deleteTaskUsecase = deleteTaskUsecase;
    this.importTasksFromCsvUsecase = importTasksFromCsvUsecase;
  }

  async findAll(req, res) {
    const tasks = await this.findAllTasksUsecase.execute();
    return res.status(200).json({
      tasks,
    });
  }

  async findById(req, res) {
    const task = await this.findTaskByIdUsecase.execute(req.params.id);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    return res.status(200).json({
      task,
    });
  }

  async create(req, res) {
    const { title, description } = req.body;
    const task = await this.createTaskUsecase.execute({ title, description });
    res.status(201).json({
      task,
    });
  }

  async update(req, res) {
    const { id } = req.params;
    const { title, description } = req.body;
    const task = await this.updateTaskUsecase.execute({
      id,
      title,
      description,
    });
    res.status(200).json({
      data: {
        task,
      },
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    await this.deleteTaskUsecase.execute(id);
    res.status(204).json();
  }

  async complete(req, res) {
    const { id } = req.params;
    const task = await this.completeTaskUsecase.execute({
      id,
    });
    res.status(200).json({
      data: {
        task,
      },
    });
  }
  async importFromCsv(req, res) {
    const { file } = req;
    const tasks = await this.importTasksFromCsvUsecase.execute(file);
    return res.status(201).json({
      tasks,
    });
  }
}

export { TasksController };
