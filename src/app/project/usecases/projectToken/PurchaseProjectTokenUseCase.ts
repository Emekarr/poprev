import ClientError from "../../../../errors/ClientError";
import { validateNewProjectTokenPayload } from "../../validators/projectToken";
import ApplicationError from "../../../../errors/ApplicationError";
import projectTokenRepo from "../../repository/projectTokenRepo";
import { IProjectTokenDocument, ProjectToken } from "../../model/ProjectToken";
import { ClientSession } from "mongoose";
import CreateTransactionUseCase from "../../../transaction/usecases/transaction/CreateTransactionUseCase";
import CreatePurchasedTokenUseCase from "../purchasedToken/CreatePurchasedTokenUseCase";

export default abstract class PurchaseProjectTokenUseCase {
  private static validateNewProjectTokenPayload =
    validateNewProjectTokenPayload;

  private static projectTokenRepo = projectTokenRepo;

  static async execute(tokenId: string, amount: number, userId: string) {
    const token = await this.projectTokenRepo.findById(tokenId);
    if (!token) throw new ClientError("token does not exist", 404);
    if (token.amountRemaining <= 0) {
      throw new ClientError("this token is sold out", 400);
    }
    if (token.amountRemaining < amount) {
      throw new ClientError(
        `only ${token.amountRemaining} worth of token is available`,
        400
      );
    }
    const session = await this.projectTokenRepo.startSession();
    session.startTransaction();
    const transaction = await CreateTransactionUseCase.execute(
      {
        amount,
        description: `for the purchase of ${token.name} tokens`,
      },
      session
    );
    const purchasedToken = await CreatePurchasedTokenUseCase.execute(
      tokenId,
      transaction.id,
      userId,
      amount,
      token.name,
      session
    );
    return { transaction, purchasedToken };
  }
}
