import ClientError from "../../../errors/ClientError";
import { User, IUserDocument } from "../models/User";
import { validateNewUserPayload } from "../validators/user";
import userRepo from "../repository/userRepo";
import hasher from "../../../security/hasher";
import ApplicationError from "../../../errors/ApplicationError";

export default abstract class CreateUserUseCase {
  private static validateNewUserPayload = validateNewUserPayload;

  private static userRepo = userRepo;

  private static hasher = hasher;

  static async execute(payload: User): Promise<IUserDocument> {
    const result = this.validateNewUserPayload(payload);
    if (result.error) throw new ClientError(result.error.message, 400);
    const userExists = await this.userRepo.countDocs({
      email: result.value.email,
    });
    if (userExists != 0) throw new ClientError("email is already in use", 409);
    result.value.password = this.hasher.hashPassword(result.value.password);
    const user = await this.userRepo.createEntry(result.value);
    if (user == null) {
      console.log("report error to sentry");
      throw new ApplicationError("could not create new user", 500);
    }
    return user;
  }
}
