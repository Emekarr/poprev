import { NextFunction, Request, Response } from "express";
import AuthTokensManager from "../../../security/auth_tokens/tokens";
import {
  AdminAuthTokenPayload,
  TokenType,
  UserAuthTokenPayload,
} from "../../../security/auth_tokens/type";
import ServerResponse from "../../../utils/response";
import { LoginPayload } from "../types";
import LoginAdminUseCase from "../usecases/LoginAdminUseCase";
import LoginUserUseCase from "../usecases/LoginUserUseCase";

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
        adminId: user.id,
        name: user.name,
        type: TokenType.AccessToken,
        iss: process.env.JWT_ISSUER,
      } as UserAuthTokenPayload);
      const refreshToken = await AuthTokensManager.generateRefreshToken({
        email: user.email,
        adminId: user.id,
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
}
