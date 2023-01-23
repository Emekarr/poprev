export default class ApplicationError extends Error {
  readonly name = "ApplicationError";
  constructor(message: string, readonly errorCode: number) {
    super(message);
  }
}
