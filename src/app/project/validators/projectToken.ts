import Joi from "joi";
import { Project } from "../model/Project";

export const validateNewProjectPayload = (payload: Project) =>
  Joi.object({
    name: Joi.string().max(200).required(),
    projectId: Joi.string().required(),
    artisteName: Joi.string().max(50).required(),
    amount: Joi.number().positive().required,
    amountRemaining: Joi.number().positive().required,
  }).validate(payload) as Joi.ValidationResult<Project>;
