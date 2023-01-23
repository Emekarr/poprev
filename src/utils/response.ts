import { Response } from "express";

export default class ServerResponse {
  constructor(
    private message: string = "",
    private data: object | null = null,
    private success: boolean = true
  ) {}

  respond(res: Response, status_code: number) {
    const payload = {
      message: this.message,
      data: this.data,
      success: this.success,
    };

    res.status(status_code).json(payload);
  }
}
