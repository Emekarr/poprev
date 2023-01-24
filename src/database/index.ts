import mongodb from "./mongo";
import redis from "./redis";

export default async () => {
  // connect to mongodb
  mongodb.connect();
  await redis();
};
