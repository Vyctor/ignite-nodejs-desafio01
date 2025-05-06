import { Task } from "../../domain/task.js";

export class ImportTasksFromCsvUsecase {
  constructor(taskRepository, csvParser, fs) {
    this.taskRepository = taskRepository;
    this.csvParser = csvParser;
    this.fs = fs;
  }

  async execute(filePath) {
    const importedTasks = [];

    await new Promise((resolve, reject) => {
      this.fs
        .createReadStream(filePath)
        .pipe(this.csvParser())
        .on("data", async (row) => {
          const { title, description } = row;

          const task = Task.build({
            title,
            description,
          });

          const createdTask = await this.taskRepository.create(task);
          importedTasks.push(createdTask);
        })
        .on("end", () => {
          this.fs.unlinkSync(filePath);
          resolve();
        })
        .on("error", (error) => {
          this.fs.unlinkSync(filePath);
          reject(error);
        });
    });

    return importedTasks;
  }
}
