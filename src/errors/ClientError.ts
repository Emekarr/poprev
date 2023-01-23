import { CustomError } from "./types";

export default class ClientError extends Error implements CustomError {
  readonly name = "ClientError";
  constructor(message: string, readonly errorCode: number) {
    super(message);
  }
}
