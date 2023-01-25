import { Document, model, PaginateModel, Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface ProjectToken {
  name: string;
  projectId: string;
  artisteName: string;
  amount: number;
  amountRemaining: number;
}

export interface IProjectToken extends ProjectToken {}

export interface IProjectTokenDocument extends IProjectToken, Document {}

const projectTokenSchemaFields: Record<keyof IProjectToken, any> = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  projectId: {
    type: Types.ObjectId,
    required: true,
    ref: "Project",
  },
  artisteName: { type: String, required: true, trim: true },
  amount: {
    type: Number,
    required: true,
  },
  amountRemaining: {
    type: Number,
    required: true,
  },
};

const ProjectTokenSchema = new Schema(projectTokenSchemaFields, {
  timestamps: true,
});

ProjectTokenSchema.plugin(mongoosePaginate);

ProjectTokenSchema.method("toJSON", function (this: IProjectTokenDocument) {
  const projectToken = this.toObject() as Partial<IProjectTokenDocument>;
  delete projectToken.__v;
  return projectToken;
});

export default model<
  IProjectTokenDocument,
  PaginateModel<IProjectTokenDocument>
>("ProjectToken", ProjectTokenSchema);
