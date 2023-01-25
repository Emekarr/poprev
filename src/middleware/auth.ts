import { NextFunction, Request, Response } from "express";
import ServerResponse from "../utils/response";
import AuthTokensManager from "../security/auth_tokens/tokens";
import ClientError from "../errors/ClientError";
import RedisRepository from "../repository/redis";
import { AuthTokenType, TokenType } from "../security/auth_tokens/type";

const AuthMiddleware =
  (adminRoute: boolean = false) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenHeader = req.headers.authorization;
      if (typeof tokenHeader === "undefined")
        return new ServerResponse(
          "an access token is required for this route"
        ).respond(res, 401);
      const bearer = tokenHeader.split(" ")[1];
      const result = (await AuthTokensManager.verifyToken(
        bearer
      )) as AuthTokenType;
      if (result.type != TokenType.AccessToken)
        return new ServerResponse("invalid access token used").respond(
          res,
          401
        );
      if (result.iss !== process.env.JWT_ISSUER)
        return new ServerResponse("invalid access token used").respond(
          res,
          401
        );
      if (adminRoute) {
        if (!result.adminId || result.adminId == "")
          return new ServerResponse(
            "you do not have access to this route"
          ).respond(res, 401);
      }
      const tokens = await RedisRepository.findSet(`${result.userId}-logout`);
      const exists = tokens.find((token) => {
        return JSON.parse(token).token === bearer;
      });
      if (exists) throw new ClientError("access denied", 403);
      req.user = {
        email: result.email,
        id: result.userId
          ? (result.userId as string)
          : (result.adminId as string),
        name: result.name,
      };
      next();
    } catch (err) {
      console.log(err);
      next(new ClientError("access denied", 403));
    }
  };

export default AuthMiddleware;
