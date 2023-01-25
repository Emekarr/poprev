import { Document, model, PaginateModel, Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface PurchasedToken {
  name: string;
  tokenId: string;
  transactionId: string;
  userId: string;
  amount: number;
}

export interface IPurchasedToken extends PurchasedToken {}

export interface IPurchasedTokenDocument extends IPurchasedToken, Document {}

const purchasedTokenSchemaFields: Record<keyof IPurchasedToken, any> = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  tokenId: {
    type: Types.ObjectId,
    required: true,
    ref: "ProjectToken",
    index: true,
  },
  transactionId: {
    type: Types.ObjectId,
    required: true,
    ref: "Transaction",
  },
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },
  amount: {
    type: Number,
    required: true,
  },
};

const PurchasedTokenSchema = new Schema(purchasedTokenSchemaFields, {
  timestamps: true,
});

PurchasedTokenSchema.plugin(mongoosePaginate);

PurchasedTokenSchema.method("toJSON", function (this: IPurchasedTokenDocument) {
  const purchasedToken = this.toObject() as Partial<IPurchasedTokenDocument>;
  delete purchasedToken.__v;
  return purchasedToken;
});

export default model<
  IPurchasedTokenDocument,
  PaginateModel<IPurchasedTokenDocument>
>("PurchasedToken", PurchasedTokenSchema);
