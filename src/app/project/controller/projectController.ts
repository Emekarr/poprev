import { Request, Response, NextFunction } from "express";
import { emailService } from "../../../messaging";
import { generateOtp } from "../../../security/otp";
import ServerResponse from "../../../utils/response";
import { Project } from "../model/Project";
import projectTokenRepo from "../repository/projectTokenRepo";
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

  static async fetchProjectTokens(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, limit, name } = req.query;
      const tokens = await projectTokenRepo.findManyByFields(
        { name: { $regex: name ?? "", $options: "i" } },
        { limit: Number(limit), page: Number(page) }
      );
      new ServerResponse("project tokens fetched", tokens, true).respond(
        res,
        200
      );
    } catch (err) {
      next(err);
    }
  }
}
