import ClientError from "../../../errors/ClientError";
import { LoginPayload } from "../types";
import { validateLoginPayload } from "../validators/authValidators";
import userRepo from "../../user/repository/userRepo";
import hasher from "../../../security/hasher";

export default abstract class LoginUserUseCase {
  private static validateLoginPayload = validateLoginPayload;

  private static userRepo = userRepo;

  private static haser = hasher;

  static async execute(payload: LoginPayload) {
    const result = this.validateLoginPayload(payload);
    if (result.error) throw new ClientError(result.error.message, 400);
    const user = await this.userRepo.findOneByFields({
      email: result.value.email,
    });
    if (!user) throw new ClientError("user does not exist", 404);
    const success = await this.haser.verifyPassword(
      result.value.password,
      user.password
    );
    if (!success) throw new ClientError("incorrect password", 401);
    return user;
  }
}
