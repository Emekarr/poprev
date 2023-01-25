import { Document, model, PaginateModel, Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface Project {
  name: string;
  createdBy: string;
  artisteName: string;
  amount: number;
}

export interface IProject extends Project {}

export interface IProjectDocument extends IProject, Document {}

const projectSchemaFields: Record<keyof IProject, any> = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: Types.ObjectId,
    required: true,
    ref: "Admin",
  },
  artisteName: { type: String, required: true, trim: true },
  amount: {
    type: Number,
    required: true,
  },
};

const ProjectSchema = new Schema(projectSchemaFields, { timestamps: true });

ProjectSchema.plugin(mongoosePaginate);

ProjectSchema.method("toJSON", function (this: IProjectDocument) {
  const project = this.toObject() as Partial<IProjectDocument>;
  delete project.__v;
  return project;
});

export default model<IProjectDocument, PaginateModel<IProjectDocument>>(
  "Project",
  ProjectSchema
);
