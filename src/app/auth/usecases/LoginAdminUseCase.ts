import { LoginPayload } from "../types";
import { validateLoginPayload } from "../validators/authValidators";
import adminRepo from "../../admin/repository/adminRepo";
import ClientError from "../../../errors/ClientError";
import hasher from "../../../security/hasher";

export default abstract class LoginAdminUseCase {
  private static validateLoginPayload = validateLoginPayload;

  private static adminRepo = adminRepo;

  private static hasher = hasher;

  static async execute(payload: LoginPayload) {
    const result = this.validateLoginPayload(payload);
    if (result.error) throw new ClientError(result.error.message, 400);
    const admin = await this.adminRepo.findOneByFields({
      email: result.value.email,
    });
    if (!admin) throw new ClientError("admin does not exist", 404);
    const success = await this.hasher.verifyPassword(
      result.value.password,
      admin.password
    );
    if (!success) throw new ClientError("incorrect password", 401);
    return admin;
  }
}
