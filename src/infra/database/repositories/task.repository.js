import { Task } from "../../../domain/task.js";

export class TaskRepository {
  constructor(mongoClient, redisClient) {
    this.mongoClient = mongoClient;
    this.redisClient = redisClient;
  }

  async findAll() {
    const data = await this.mongoClient.instance
      .db("tasks")
      .collection("tasks")
      .find()
      .toArray();

    return data.map((task) => {
      return new Task({
        id: task._id,
        title: task.title,
        description: task.description,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        completedAt: task.completedAt,
      });
    });
  }

  async findById(id) {
    const cacheKey = `task:${id}`;
    const cachedTask = await this.redisClient.get(cacheKey);

    if (cachedTask) {
      console.info("Cache hit for task:", id);
      return new Task({
        id: cachedTask._id,
        title: cachedTask.title,
        description: cachedTask.description,
        createdAt: cachedTask.createdAt,
        updatedAt: cachedTask.updatedAt,
        completedAt: cachedTask.completedAt,
      });
    }
    const data = await this.mongoClient.instance
      .db("tasks")
      .collection("tasks")
      .findOne({ _id: id });

    if (!data) {
      return null;
    }

    const task = new Task({
      id: data._id,
      title: data.title,
      description: data.description,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      completedAt: data.completedAt,
    });

    await this.redisClient.set(cacheKey, task, {
      EX: 60 * 60,
    });

    return task;
  }

  async create(task) {
    await this.mongoClient.instance.db("tasks").collection("tasks").insertOne({
      _id: task.id,
      title: task.title,
      description: task.description,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      completedAt: task.completedAt,
    });
    return task;
  }

  async update(task) {
    const taskExists = await this.findById(task.id);
    if (!taskExists) {
      return null;
    }

    await this.redisClient.del(`task:${task.id}`);

    return this.mongoClient.instance
      .db("tasks")
      .collection("tasks")
      .updateOne(
        { _id: task.id },
        {
          $set: {
            title: task.title,
            description: task.description,
            updatedAt: task.updatedAt,
            completedAt: task.completedAt,
          },
        }
      );
  }

  async delete(id) {
    const task = await this.findById(id);
    if (!task) {
      return null;
    }
    await this.mongoClient.instance
      .db("tasks")
      .collection("tasks")
      .deleteOne({ _id: id });

    await this.redisClient.del(`task:${id}`);
  }
}
