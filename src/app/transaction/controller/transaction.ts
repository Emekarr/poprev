import { Request, Response, NextFunction } from "express";
import ServerResponse from "../../../utils/response";
import transactionRepo from "../repository/transactionRepo";

export default abstract class TransactionController {
  static async fetchTokenTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, limit, id } = req.query;
      const tokens = await transactionRepo.findManyByFields(
        { tokenId: id },
        {
          limit: Number(limit),
          page: Number(page),
        }
      );
      new ServerResponse("token transactions fetched", tokens, true).respond(
        res,
        200
      );
    } catch (err) {
      next(err);
    }
  }
}
