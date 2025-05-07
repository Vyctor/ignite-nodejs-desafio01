import { MongoClient as MongoClientLib } from "mongodb";

export class MongoClient {
  instance = null;

  constructor() {
    if (this.instance) {
      return this.instance;
    }
    this.connect();
  }

  async connect() {
    const client = new MongoClientLib(process.env.MONGO_URL);
    const db = await client.connect();
    this.instance = db;
  }

  async close() {
    if (this.instance) {
      await this.instance.close();
      this.instance = null;
    }
  }
}
