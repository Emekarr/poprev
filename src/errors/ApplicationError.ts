import { CustomError } from "./types";

export default class ApplicationError extends Error implements CustomError  {
  readonly name = "ApplicationError";
  constructor(message: string, readonly errorCode: number) {
    super(message);
  }
}
