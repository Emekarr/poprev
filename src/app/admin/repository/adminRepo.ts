import AdminModel, { IAdminDocument } from "../models/Admin";

import MongoDbRepository from "../../../repository/mongodb/index";

class AdminRepository extends MongoDbRepository<IAdminDocument> {
  constructor() {
    super(AdminModel);
  }
}

export default new AdminRepository();
