import { Request, Response, NextFunction } from "express";
import { emailService } from "../../../messaging";
import { generateOtp } from "../../../security/otp";
import ServerResponse from "../../../utils/response";
import { User } from "../models/User";
import CreateUserUseCase from "../usecases/CreateUserUseCase";

export default abstract class UserController {
  static async createNewUser(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: User = req.body;
      await CreateUserUseCase.execute(payload);
      const otp = await generateOtp(`${payload.email}-otp`);
      // send this through an event stream to avoid keeping the user waiting
      await emailService.send(
        payload.email,
        `Your otp is ${otp}`,
        "Verify your PopRev account"
      );
      new ServerResponse("user created.", null, true).respond(res, 201);
    } catch (err) {
      next(err);
    }
  }
}
