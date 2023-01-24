import redisRepo from "../repository/redis";

export const generateOtp = async (key: string): Promise<string> => {
  const otp = Math.floor(100000 + Math.random() * 899999).toString();
  // cache for 10 mins
  await redisRepo.createEntryAndExpire(key, otp, 600);
  return otp;
};
