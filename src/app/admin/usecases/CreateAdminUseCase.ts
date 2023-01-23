import ClientError from "../../../errors/ClientError";
import { Admin, IAdminDocument } from "../models/Admin";
import { validateNewAdminPayload } from "../validators/admin";
import adminRepo from "../repository/adminRepo";
import hasher from "../../../security/hasher";
import ApplicationError from "../../../errors/ApplicationError";

export default abstract class CreateAdminUseCase {
  private static validateNewAdminPayload = validateNewAdminPayload;

  private static adminRepo = adminRepo;

  private static hasher = hasher;

  static async execute(payload: Admin): Promise<IAdminDocument> {
    const result = this.validateNewAdminPayload(payload);
    if (result.error) throw new ClientError(result.error.message, 400);
    const adminExists = await this.adminRepo.countDocs({
      email: result.value.email,
    });
    if (adminExists != 0) throw new ClientError("email is already in use", 409);
    result.value.password = this.hasher.hashPassword(result.value.password);
    const admin = await this.adminRepo.createEntry(result.value);
    if (admin == null) {
      console.log("report error to sentry");
      throw new ApplicationError("could not create new admin", 500);
    }
    return admin;
  }
}
