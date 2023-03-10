import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import rateLimiter, { Options } from "express-rate-limit";

// utils
import ServerResponse from "./utils/response";
import ErrorMiddleware from "./middleware/error";

// start ups
import("./startup/index").then((startup) => startup.default());

// routes
import router from "./routes";

class App {
  express: Application;

  constructor() {
    this.express = express();

    this.express.use(
      cors({
        origin: (process.env.CLIENT_URL as string).split(" "),
        credentials: true,
        preflightContinue: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      })
    );

    const limiter = rateLimiter({
      windowMs: 60 * 1000, // 1 minute
      max: 20, // Limit each IP to 20 requests per minute
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      onLimitReached: (
        request: Request,
        response: Response,
        optionsUsed: Options
      ) => {
        return new ServerResponse(
          "too many requests. slow down",
          null,
          false
        ).respond(response, 429);
      },
    });

    this.express.use(limiter);

    this.express.use(express.json({ limit: process.env.JSON_LIMIT }));
    this.express.use(
      express.urlencoded({ extended: true, limit: process.env.JSON_LIMIT })
    );

    this.express.use("/api", router);

    this.express.use(
      "/ping",
      (req: Request, res: Response, next: NextFunction) => {
        try {
          new ServerResponse(`messi is the GOAT`).respond(res, 200);
        } catch (err) {
          next(err);
        }
      }
    );

    this.express.use("*", (req: Request, res: Response, next: NextFunction) => {
      try {
        new ServerResponse(
          `the route ${req.method} ${req.baseUrl} does not exist`
        ).respond(res, 404);
      } catch (err) {
        next(err);
      }
    });

    this.express.use(ErrorMiddleware);
  }

  listen(port: string, cb: () => void) {
    this.express.listen(port, cb);
  }
}

export default new App();
