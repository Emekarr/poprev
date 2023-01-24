import { RedisClientType } from "@redis/client";
import { createClient } from "redis";

import CachingRepo from "./types";

export default abstract class RedisRepository implements Partial<CachingRepo> {
  private static redis: RedisClientType;

  static async connectRedis() {
    this.redis = await createClient({ url: process.env.REDIS_URL as string });
    this.redis.on("error", (err) => console.log("Redis Client Error", err));
    await this.redis.connect();
  }

  static async createEntry(key: string, payload: any): Promise<boolean> {
    let success!: boolean;
    try {
      const result = await this.redis.SET(key, JSON.stringify(payload));
      if (result !== "OK") throw new Error("Caching failed.");
      success = true;
    } catch (err) {
      success = false;
    }
    return success;
  }

  static async createEntryAndExpire(
    key: string,
    payload: any,
    expireIn: number
  ): Promise<boolean> {
    let success!: boolean;
    try {
      const result = await this.redis.SET(key, JSON.stringify(payload));
      if (result !== "OK") throw new Error("Caching failed.");
      this.redis.EXPIRE(key, expireIn);
      success = true;
    } catch (err) {
      success = false;
    }
    return success;
  }

  static async createInSet(key: string, payload: any): Promise<boolean> {
    let success!: boolean;
    try {
      this.redis.ZADD(key, {
        score: Date.now(),
        value: JSON.stringify(payload),
      });
      success = true;
    } catch (err) {
      console.log(err);
      success = false;
    }
    return success;
  }

  static async incrementEntry(key: string): Promise<number | string> {
    let count!: number | string;
    try {
      count = await this.redis.INCR(key);
    } catch (err: any) {
      count = err.message;
    }
    return count;
  }

  static async findSet(key: string): Promise<string[]> {
    let result!: string[];
    try {
      result = await this.redis.ZRANGE(key, 0, -1);
      if (!result) throw new Error("Set not found");
    } catch (err) {
      result = [];
    }
    return result;
  }

  static async updateSet(key: string, payload: any): Promise<boolean> {
    let success!: boolean;
    try {
      this.redis.ZADD(key, {
        score: Date.now(),
        value: JSON.stringify(payload),
      });
      success = true;
    } catch (err) {
      success = false;
    }
    return success;
  }

  static async updateFixedLengthSet(
    key: string,
    payload: any,
    maxLength: number
  ): Promise<boolean> {
    let success!: boolean;
    try {
      const setSize = await this.redis.ZCARD(key);
      if (setSize >= maxLength) {
        await this.redis.ZREMRANGEBYSCORE(key, -Infinity, setSize - maxLength);
      }
      this.redis.ZADD(key, {
        score: Date.now(),
        value: JSON.stringify(payload),
      });
      success = true;
    } catch (err) {
      success = false;
    }
    return success;
  }

  static async findOne(key: string): Promise<string | null> {
    let result!: string | null;
    try {
      const data = await this.redis.GET(key);
      if (!data) throw new Error("Could not retrieve data");
      result = JSON.parse(data);
    } catch (err) {
      result = null;
    }
    return result;
  }

  static async findOneAndDelete(key: string): Promise<boolean> {
    let result!: boolean;
    try {
      const data = await this.redis.GET(key);
      if (!data) throw new Error("Could not retrieve data");
      const deleted = await this.redis.DEL(key);
      if (deleted !== 1) throw new Error("Deletion failed");
      result = JSON.parse(data);
    } catch (err) {
      result = false;
    }
    return result;
  }

  static async updateOne(key: string, payload: string): Promise<boolean> {
    let success!: boolean;
    try {
      const result = await this.redis.SET(key, payload);
      if (!result) throw new Error("Update failed");
      success = true;
    } catch (err) {
      success = false;
    }
    return success;
  }

  static async deleteOne(key: string): Promise<boolean> {
    let success!: boolean;
    try {
      const deleted = await this.redis.DEL(key);
      if (deleted !== 1) throw new Error("Deletion failed");
      success = true;
    } catch (err) {
      success = false;
    }
    return success;
  }

  static async deleteFromSet(key: string, payload: string[]): Promise<boolean> {
    let success!: boolean;
    try {
      await this.redis.ZREM(key, payload);
    } catch (err) {
      success = false;
    }
    return success;
  }
  static async __truncate(): Promise<void> {
    await this.redis.FLUSHDB();
  }
}
