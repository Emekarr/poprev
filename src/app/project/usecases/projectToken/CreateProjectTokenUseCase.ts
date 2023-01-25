import ClientError from "../../../../errors/ClientError";
import { validateNewProjectTokenPayload } from "../../validators/projectToken";
import ApplicationError from "../../../../errors/ApplicationError";
import projectTokenRepo from "../../repository/projectTokenRepo";
import { IProjectTokenDocument, ProjectToken } from "../../model/ProjectToken";
import { ClientSession } from "mongoose";

export default abstract class CreateProjectTokenUseCase {
  private static validateNewProjectTokenPayload =
    validateNewProjectTokenPayload;

  private static projectTokenRepo = projectTokenRepo;

  static async execute(
    payload: ProjectToken,
    session: ClientSession
  ): Promise<IProjectTokenDocument> {
    const result = this.validateNewProjectTokenPayload(payload);
    if (result.error) {
      session.abortTransaction();
      throw new ClientError(result.error.message, 400);
    }
    const token = await this.projectTokenRepo.createEntryTrx(result.value, {
      session,
    });
    if (token === null) {
      console.log("alert on error monitoring software");
      session.abortTransaction();
      throw new ApplicationError("could not create project token", 500);
    }
    session.commitTransaction();
    return token[0];
  }
}
