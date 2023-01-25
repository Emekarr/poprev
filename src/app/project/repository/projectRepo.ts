import ProjectModel, { IProjectDocument } from "../model/Project";

import MongoDbRepository from "../../../repository/mongodb/index";

class ProjectRepository extends MongoDbRepository<IProjectDocument> {
  constructor() {
    super(ProjectModel);
  }
}

export default new ProjectRepository();
