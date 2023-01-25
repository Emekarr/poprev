import jwt from "jsonwebtoken";
import { AdminAuthTokenPayload, TokenType, UserAuthTokenPayload } from "./type";

export default abstract class AuthTokensManager {
  private static jwt = jwt;

  static async generateAccessToken(
    payload: AdminAuthTokenPayload | UserAuthTokenPayload
  ) {
    payload.type = TokenType.AccessToken;
    return this.generateTokens(
      payload,
      parseInt(process.env.ACCESS_TOKEN_LIFE as string, 10) // expires in 60 mins
    );
  }

  static async generateRefreshToken(
    payload: AdminAuthTokenPayload | UserAuthTokenPayload
  ) {
    payload.type = TokenType.RefreshToken;
    return this.generateTokens(
      payload,
      parseInt(process.env.REFRESH_TOKEN_LIFE as string, 10) // expires in 30 days
    );
  }

  private static async generateTokens(
    paylaod: AdminAuthTokenPayload | UserAuthTokenPayload,
    expiresIn: number
  ) {
    return this.jwt.sign(paylaod, process.env.JWT_SECRET as string, {
      expiresIn,
    });
  }

  static async verifyToken(token: string) {
    return this.jwt.verify(token, process.env.JWT_SECRET as string);
  }
}
