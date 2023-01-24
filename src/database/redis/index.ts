import RedisRepository from "../../repository/redis";

export default async () => {
  await RedisRepository.connectRedis();
};
