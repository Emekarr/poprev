import ClientError from "../../../../errors/ClientError";
import { IProjectDocument, Project } from "../../model/Project";
import { validateNewProjectPayload } from "../../validators/project";
import ApplicationError from "../../../../errors/ApplicationError";
import projectRepo from "../../repository/projectRepo";
import CreateProjectTokenUseCase from "../projectToken/CreateProjectTokenUseCase";
import { IProjectTokenDocument, ProjectToken } from "../../model/ProjectToken";
import projectTokenRepo from "../../repository/projectTokenRepo";

export default abstract class CreateProjectUseCase {
  private static validateNewProjectPayload = validateNewProjectPayload;

  private static projectRepo = projectRepo;

  static async execute(payload: Project) {
    const result = this.validateNewProjectPayload(payload);
    if (result.error) throw new ClientError(result.error.message, 400);
    const dbSessions = await this.projectRepo.startSession();
    dbSessions.startTransaction();
    const project = (
      await this.projectRepo.createEntryTrx(result.value, {
        session: dbSessions,
      })
    )[0];
    if (project === null) {
      console.log("alert on error monitoring software");
      dbSessions.abortTransaction();
      throw new ApplicationError("could not create project", 500);
    }
    const projectToken = await CreateProjectTokenUseCase.execute(
      {
        projectId: project.id,
        name: project.name,
        artisteName: project.artisteName,
        amount: project.amount,
        amountRemaining: project.amount,
      },
      dbSessions
    );
    return { project, projectToken };
  }
}
