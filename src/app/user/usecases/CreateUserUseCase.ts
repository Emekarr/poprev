import ClientError from "../../../errors/ClientError";
import { User } from "../models/User";
import { validateNewUserPayload } from "../validators/user";
import userRepo from "../repository/userRepo";
import redisRepo from "../../../repository/redis";
import hasher from "../../../security/hasher";
import ApplicationError from "../../../errors/ApplicationError";

export default abstract class CreateUserUseCase {
  private static validateNewUserPayload = validateNewUserPayload;

  private static userRepo = userRepo;

  private static hasher = hasher;

  private static redisRepo = redisRepo;

  static async execute(payload: User): Promise<boolean> {
    const result = this.validateNewUserPayload(payload);
    if (result.error) throw new ClientError(result.error.message, 400);
    const userExists = await this.userRepo.countDocs({
      email: result.value.email,
    });
    if (userExists != 0) throw new ClientError("email is already in use", 409);
    result.value.password = this.hasher.hashPassword(result.value.password);
    // cache user
    const user = await this.redisRepo.createEntryAndExpire(
      `${result.value.email}-cached-user`,
      result.value,
      600
    );
    if (!user) {
      console.log("report error to sentry");
      throw new ApplicationError("could not create new user", 500);
    }
    return user;
  }
}
