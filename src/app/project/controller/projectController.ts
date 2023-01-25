import { Request, Response, NextFunction } from "express";
import { emailService } from "../../../messaging";
import { generateOtp } from "../../../security/otp";
import ServerResponse from "../../../utils/response";
import { Project } from "../model/Project";
import projectTokenRepo from "../repository/projectTokenRepo";
import purchasedTokenRepo from "../repository/purchasedTokenRepo";
import CreateProjectUseCase from "../usecases/project/CreateProjectUseCase";
import PurchaseProjectTokenUseCase from "../usecases/projectToken/PurchaseProjectTokenUseCase";

export default abstract class ProjectController {
  static async createNewProject(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const payload: Project = req.body;
      payload.createdBy = req.user.id;
      const result = await CreateProjectUseCase.execute(payload);
      new ServerResponse("project created.", result, true).respond(res, 201);
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

  static async purchaseToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.query;
      const result = await PurchaseProjectTokenUseCase.execute(
        id as string,
        req.body.amount,
        req.user.id
      );
      new ServerResponse("purchase complete", result, true).respond(res, 200);
    } catch (err) {
      next(err);
    }
  }

  static async fetchPurchasedTokens(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, limit, id } = req.query;
      const tokens = await purchasedTokenRepo.findManyByFields(
        { tokenId: id, userId: req.user.id },
        {
          limit: Number(limit),
          page: Number(page),
        }
      );
      new ServerResponse(
        "token purchase history fetched",
        tokens,
        true
      ).respond(res, 200);
    } catch (err) {
      next(err);
    }
  }
}
