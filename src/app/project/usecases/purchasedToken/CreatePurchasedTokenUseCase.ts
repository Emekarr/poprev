import ClientError from "../../../../errors/ClientError";
import { validateNewPurchasedTokenPayload } from "../../validators/purchasedToken";
import ApplicationError from "../../../../errors/ApplicationError";
import projectTokenRepo from "../../repository/projectTokenRepo";
import purchasedTokenRepo from "../../repository/purchasedTokenRepo";
import { ClientSession } from "mongoose";
import { IPurchasedTokenDocument } from "../../model/PurchasedToken";

export default abstract class CreatePurchasedTokenUseCase {
  private static validateNewPurchasedTokenPayload =
    validateNewPurchasedTokenPayload;

  private static projectTokenRepo = projectTokenRepo;

  private static purchasedTokenRepo = purchasedTokenRepo;

  static async execute(
    tokenId: string,
    transactionId: string,
    userId: string,
    amount: number,
    session: ClientSession
  ): Promise<IPurchasedTokenDocument> {
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
    await this.projectTokenRepo.updateByIdTrx(
      tokenId,
      {
        $inc: { amountRemaining: -amount },
      },
      { session }
    );
    const purchasedToken = await this.purchasedTokenRepo.createEntryTrx(
      {
        tokenId,
        transactionId,
        userId,
        name: token.name,
        amount,
      },
      { session }
    );
    session.commitTransaction();
    return purchasedToken[0];
  }
}
