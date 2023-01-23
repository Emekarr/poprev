import express, { Application } from "express";
import cors from "cors";

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
  }

  listen(port: string, cb: () => void) {
    this.express.listen(port, cb);
  }
}

export default new App();
