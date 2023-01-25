import { NextFunction, Request, Response } from "express";
import AuthTokensManager from "../../../security/auth_tokens/tokens";
import {
  AdminAuthTokenPayload,
  TokenType,
  UserAuthTokenPayload,
} from "../../../security/auth_tokens/type";
import { generateOtp } from "../../../security/otp";
import ServerResponse from "../../../utils/response";
import { emailService } from "../../../messaging";
import { LoginPayload } from "../types";
import LoginAdminUseCase from "../usecases/LoginAdminUseCase";
import LoginUserUseCase from "../usecases/LoginUserUseCase";
import ClientError from "../../../errors/ClientError";

export default abstract class AuthController {
  static async loginAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: LoginPayload = req.body;
      const admin = await LoginAdminUseCase.execute(payload);
      const accessToken = await AuthTokensManager.generateAccessToken({
        email: admin.email,
        adminId: admin.id,
        name: admin.name,
        type: TokenType.AccessToken,
        iss: process.env.JWT_ISSUER,
      } as AdminAuthTokenPayload);
      const refreshToken = await AuthTokensManager.generateRefreshToken({
        email: admin.email,
        adminId: admin.id,
        name: admin.name,
        type: TokenType.RefreshToken,
        iss: process.env.JWT_ISSUER,
      } as AdminAuthTokenPayload);
      new ServerResponse(
        "login successful",
        {
          admin,
          tokens: {
            accessToken,
            refreshToken,
          },
        },
        true
      ).respond(res, 200);
    } catch (err) {
      next(err);
    }
  }

  static async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: LoginPayload = req.body;
      const user = await LoginUserUseCase.execute(payload);
      const accessToken = await AuthTokensManager.generateAccessToken({
        email: user.email,
        userId: user.id,
        name: user.name,
        type: TokenType.AccessToken,
        iss: process.env.JWT_ISSUER,
      } as UserAuthTokenPayload);
      const refreshToken = await AuthTokensManager.generateRefreshToken({
        email: user.email,
        userId: user.id,
        name: user.name,
        type: TokenType.RefreshToken,
        iss: process.env.JWT_ISSUER,
      } as UserAuthTokenPayload);
      new ServerResponse(
        "login successful",
        {
          user,
          tokens: {
            accessToken,
            refreshToken,
          },
        },
        true
      ).respond(res, 200);
    } catch (err) {
      next(err);
    }
  }

  static async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.query;
      if (!email) throw new ClientError("pass in an email", 400);
      const otp = await generateOtp(`${email}-otp`);
      // send this through an event stream to avoid keeping the user waiting
      await emailService.send(
        email as string,
        `Your otp is ${otp}. This OTP will last for 10 mins.`,
        "OTP requested"
      );
      new ServerResponse("otp sent", null, true).respond(res, 201);
    } catch (err) {
      next(err);
    }
  }
}
