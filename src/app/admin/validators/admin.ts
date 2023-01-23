import Joi from "joi";
import { joiPasswordExtendCore } from "joi-password";
const JoiPassword = Joi.extend(joiPasswordExtendCore);

import { Admin } from "../models/Admin";

export const validateNewAdminPayload = (payload: Admin) =>
  Joi.object({
    name: Joi.string().max(50).required(),
    email: Joi.string().email().required(),
    password: JoiPassword.string()
      .min(6)
      .minOfSpecialCharacters(1)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required(),
  }).validate(payload) as Joi.ValidationResult<Admin>;
