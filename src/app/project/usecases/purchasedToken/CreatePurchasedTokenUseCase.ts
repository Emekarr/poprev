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
    name: string,
    session: ClientSession
  ): Promise<IPurchasedTokenDocument> {
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
        name,
        amount,
      },
      { session }
    );
    session.commitTransaction();
    return purchasedToken[0];
  }
}
