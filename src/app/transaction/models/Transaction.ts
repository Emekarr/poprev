import { Document, model, PaginateModel, Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface Transaction {
  description: string;
  trxId: string;
  amount: number;
}

export interface ITransaction extends Transaction {}

export interface ITransactionDocument extends ITransaction, Document {}

const transactionSchemaFields: Record<keyof ITransaction, any> = {
  trxId: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
  },
};

const TransactionSchema = new Schema(transactionSchemaFields, {
  timestamps: true,
});

TransactionSchema.plugin(mongoosePaginate);

TransactionSchema.method("toJSON", function (this: ITransactionDocument) {
  const transaction = this.toObject() as Partial<ITransactionDocument>;
  delete transaction.__v;
  return transaction;
});

export default model<ITransactionDocument, PaginateModel<ITransactionDocument>>(
  "Transaction",
  TransactionSchema
);
