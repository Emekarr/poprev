import TransactionModel, { ITransactionDocument } from "../models/Transaction";

import MongoDbRepository from "../../../repository/mongodb/index";

class TransactionRepository extends MongoDbRepository<ITransactionDocument> {
  constructor() {
    super(TransactionModel);
  }
}

export default new TransactionRepository();
