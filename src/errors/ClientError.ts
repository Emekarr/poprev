export default class ClientError extends Error {
  readonly name = "ClientError";
  constructor(message: string, readonly errorCode: number) {
    super(message);
  }
}
