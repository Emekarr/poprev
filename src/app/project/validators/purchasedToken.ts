import Joi from "joi";
import { PurchasedToken } from "../model/PurchasedToken";

export const validateNewPurchasedTokenPayload = (payload: PurchasedToken) =>
  Joi.object({
    name: Joi.string().max(200).required(),
    tokenId: Joi.string().required(),
    transactionId: Joi.string().required(),
    userId: Joi.string().required(),
    amount: Joi.number().positive().required(),
  }).validate(payload) as Joi.ValidationResult<PurchasedToken>;
