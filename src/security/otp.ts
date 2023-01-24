import redisRepo from "../repository/redis";
import hasher from "./hasher";

export const generateOtp = async (key: string): Promise<string> => {
  const otp = Math.floor(100000 + Math.random() * 899999).toString();
  // cache for 10 mins
  await redisRepo.createEntryAndExpire(
    key,
    await hasher.hashPassword(otp),
    600
  );
  return otp;
};

export const verifyOtp = async (key: string, otp: string): Promise<boolean> => {
  const savedOtp = await redisRepo.findOne(key);
  if (savedOtp == null || "") return false;
  return await hasher.verifyPassword(otp, savedOtp);
};
