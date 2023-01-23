import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";

// utils
import ServerResponse from "./utils/response";
import ErrorMiddleware from "./middleware/error";

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

    this.express.use(express.json({ limit: process.env.JSON_LIMIT }));
    this.express.use(
      express.urlencoded({ extended: true, limit: process.env.JSON_LIMIT })
    );

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
