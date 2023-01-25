import PurchasedTokenModel, {
  IPurchasedTokenDocument,
} from "../model/PurchasedToken";

import MongoDbRepository from "../../../repository/mongodb/index";

class PurchasedTokenRepository extends MongoDbRepository<IPurchasedTokenDocument> {
  constructor() {
    super(PurchasedTokenModel);
  }
}

export default new PurchasedTokenRepository();
