import Joi from "joi";
import { LoginPayload } from "../types";

export const validateLoginPayload = (data: LoginPayload) =>
  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).validate(data) as Joi.ValidationResult<LoginPayload>;
