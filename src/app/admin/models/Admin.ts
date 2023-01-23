import { Document, model, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface Admin {
  name: string;
  email: string;
  password: string;
}

export interface IAdmin extends Admin {}

export interface IAdminDocument extends IAdmin, Document {}

const adminSchemaFields: Record<keyof IAdmin, any> = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: { type: String, required: true },
};

const AdminSchema = new Schema(adminSchemaFields, { timestamps: true });

AdminSchema.plugin(mongoosePaginate);

AdminSchema.method("toJSON", function (this: IAdminDocument) {
  const user = this.toObject() as Partial<IAdminDocument>;
  delete user.__v;
  delete user.password;
  return user;
});

export default model<IAdminDocument, PaginateModel<IAdminDocument>>(
  "Admin",
  AdminSchema
);
