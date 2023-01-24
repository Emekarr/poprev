import UserModel, { IUserDocument } from "../models/User";

import MongoDbRepository from "../../../repository/mongodb/index";

class UserRepository extends MongoDbRepository<IUserDocument> {
  constructor() {
    super(UserModel);
  }
}

export default new UserRepository();
