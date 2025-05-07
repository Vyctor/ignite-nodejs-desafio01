import { createClient } from "redis";

export class RedisClient {
  instance = null;

  constructor() {
    if (this.instance) {
      return this.instance;
    }
    this.connect();
  }

  async connect() {
    const client = createClient({
      url: process.env.REDIS_URL,
    });
    await client.connect();
    this.instance = client;
  }

  async close() {
    if (this.instance) {
      await this.instance.quit();
      this.instance = null;
    }
  }

  async get(key) {
    if (!this.instance) {
      await this.connect();
    }
    const data = await this.instance.get(key);
    return JSON.parse(data);
  }
  async set(key, value) {
    if (!this.instance) {
      await this.connect();
    }
    return this.instance.set(key, JSON.stringify(value));
  }
  async del(key) {
    if (!this.instance) {
      await this.connect();
    }
    return this.instance.del(key);
  }
}
