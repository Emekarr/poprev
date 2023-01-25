import ProjectTokenModel, {
  IProjectTokenDocument,
} from "../model/ProjectToken";

import MongoDbRepository from "../../../repository/mongodb/index";

class ProjectTokenRepository extends MongoDbRepository<IProjectTokenDocument> {
  constructor() {
    super(ProjectTokenModel);
  }
}

export default new ProjectTokenRepository();
