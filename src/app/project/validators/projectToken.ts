import Joi from "joi";
import { ProjectToken } from "../model/ProjectToken";

export const validateNewProjectTokenPayload = (payload: ProjectToken) =>
  Joi.object({
    name: Joi.string().max(200).required(),
    projectId: Joi.string().required(),
    artisteName: Joi.string().max(50).required(),
    amount: Joi.number().positive().required(),
    amountRemaining: Joi.number().positive().required(),
  }).validate(payload) as Joi.ValidationResult<ProjectToken>;
