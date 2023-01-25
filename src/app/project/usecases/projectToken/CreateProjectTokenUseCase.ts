import ClientError from "../../../../errors/ClientError";
import { validateNewProjectTokenPayload } from "../../validators/projectToken";
import ApplicationError from "../../../../errors/ApplicationError";
import projectTokenRepo from "../../repository/projectTokenRepo";
import { ProjectToken } from "../../model/ProjectToken";

export default abstract class CreateProjectTokenUseCase {
  private static validateNewProjectTokenPayload =
    validateNewProjectTokenPayload;

  private static projectTokenRepo = projectTokenRepo;

  static async execute(payload: ProjectToken): Promise<ProjectToken> {
    const result = this.validateNewProjectTokenPayload(payload);
    if (result.error) throw new ClientError(result.error.message, 400);
    const token = await this.projectTokenRepo.createEntry(result.value);
    if (token === null) {
      console.log("alert on error monitoring software");
      throw new ApplicationError("could not create project token", 500);
    }
    return token;
  }
}
