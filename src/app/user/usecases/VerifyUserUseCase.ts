import redisRepo from "../../../repository/redis";
import ClientError from "../../../errors/ClientError";
import { verifyOtp } from "../../../security/otp";
import { VerifyUserType } from "../types";
import userRepo from "../repository/userRepo";
import ApplicationError from "../../../errors/ApplicationError";

export default abstract class VerifyUserUseCase {
  private static redisRepo = redisRepo;

  private static verifyOtp = verifyOtp;

  private static userRepo = userRepo;

  static async execute(payload: VerifyUserType): Promise<boolean> {
    const user = await this.redisRepo.findOne(`${payload.email}-cached-user`);
    if (user == "" || user == null) {
      throw new ClientError(
        "user not found. try creating an account again",
        404
      );
    }
    const success = await this.verifyOtp(`${payload.email}-otp`, payload.otp);
    if (!success) throw new ClientError("wrong otp provided", 401);
    const newUser = await this.userRepo.createEntry(user);
    if (newUser === null) {
      console.log("report error to sentry");
      throw new ApplicationError("could not create new user", 500);
    }
    await this.redisRepo.deleteOne(`${payload.email}-otp`);
    return true;
  }
}
