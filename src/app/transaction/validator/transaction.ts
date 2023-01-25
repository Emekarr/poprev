import Joi from "joi";
import { Transaction } from "../models/Transaction";

export const validateNewTransactionPayload = (payload: Transaction) =>
  Joi.object({
    description: Joi.string().max(500).required(),
    trxId: Joi.string().max(20).required(),
    tokenId: Joi.string().required(),
    amount: Joi.number().positive().required(),
  }).validate(payload) as Joi.ValidationResult<Transaction>;
