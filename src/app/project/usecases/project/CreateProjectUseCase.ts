import ClientError from "../../../../errors/ClientError";
import { Project } from "../../model/Project";
import { validateNewProjectPayload } from "../../validators/project";
import ApplicationError from "../../../../errors/ApplicationError";
import projectRepo from "../../repository/projectRepo";
import CreateProjectTokenUseCase from "../projectToken/CreateProjectTokenUseCase";
import { ProjectToken } from "../../model/ProjectToken";

export default abstract class CreateProjectUseCase {
  private static validateNewProjectPayload = validateNewProjectPayload;

  private static projectRepo = projectRepo;

  static async execute(
    payload: Project
  ): Promise<{ project: Project; projectToken: ProjectToken }> {
    const result = this.validateNewProjectPayload(payload);
    if (result.error) throw new ClientError(result.error.message, 400);
    const dbSessions = await this.projectRepo.startSession();
    return await this.projectRepo.startTransaction(dbSessions, async () => {
      const project = await this.projectRepo.createEntry(result.value);
      if (project === null) {
        console.log("alert on error monitoring software");
        throw new ApplicationError("could not create project", 500);
      }
      const projectToken = await CreateProjectTokenUseCase.execute({
        projectId: project.id,
        name: project.name,
        artisteName: project.artisteName,
        amount: project.amount,
        amountRemaining: project.amount,
      });
      return { project, projectToken };
    });
  }
}
