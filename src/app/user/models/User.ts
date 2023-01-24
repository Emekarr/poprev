import { Document, model, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface User {
  name: string;
  email: string;
  password: string;
}

export interface IUser extends User {}

export interface IUserDocument extends IUser, Document {}

const userSchemaFields: Record<keyof IUser, any> = {
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

const UserSchema = new Schema(userSchemaFields, { timestamps: true });

UserSchema.plugin(mongoosePaginate);

UserSchema.method("toJSON", function (this: IUserDocument) {
  const user = this.toObject() as Partial<IUserDocument>;
  delete user.__v;
  delete user.password;
  return user;
});

export default model<IUserDocument, PaginateModel<IUserDocument>>(
  "User",
  UserSchema
);
