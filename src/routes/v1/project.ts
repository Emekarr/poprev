import { Router } from "express";
import ProjectController from "../../app/project/controller/projectController";
import AuthMiddleware from "../../middleware/auth";

const router = Router();

router.get(
  "/fetch",
  AuthMiddleware(false),
  ProjectController.fetchProjectTokens
);

export default router;
