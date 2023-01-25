import { ClientSession } from "mongoose";
import ApplicationError from "../../../../errors/ApplicationError";
import ClientError from "../../../../errors/ClientError";
import { generateTransactionId } from "../../../../utils";
import { Transaction } from "../../models/Transaction";
import transactionRepo from "../../repository/transactionRepo";
import { validateNewTransactionPayload } from "../../validator/transaction";

export default abstract class CreateTransactionUseCase {
  private static transactionRepo = transactionRepo;

  private static validateNewTransactionPayload = validateNewTransactionPayload;

  static async execute(payload: Partial<Transaction>, session: ClientSession) {
    payload.trxId = generateTransactionId();
    const result = this.validateNewTransactionPayload(payload as Transaction);
    if (result.error) throw new ClientError(result.error.message, 400);
    const transaction = (
      await this.transactionRepo.createEntryTrx(result.value)
    )[0];
    if (transaction === null)
      throw new ApplicationError("could not create transaction", 500);
    return transaction;
  }
}
