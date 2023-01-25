import { Request, Response, NextFunction } from "express";
import { emailService } from "../../../messaging";
import { generateOtp } from "../../../security/otp";
import ServerResponse from "../../../utils/response";
import { Project } from "../model/Project";
import CreateProjectUseCase from "../usecases/project/CreateProjectUseCase";

export default abstract class ProjectController {
  static async createNewProject(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const payload: Project = req.body;
      const { project, projectToken } = await CreateProjectUseCase.execute(
        payload
      );
      new ServerResponse(
        "user created.",
        {
          project,
          projectToken,
        },
        true
      ).respond(res, 201);
    } catch (err) {
      next(err);
    }
  }
}
