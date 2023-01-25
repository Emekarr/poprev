import { Router } from "express";
import ProjectController from "../../app/project/controller/projectController";
import AuthMiddleware from "../../middleware/auth";

const router = Router();

router.post(
  "/create",
  AuthMiddleware(false),
  ProjectController.fetchProjectTokens
);

export default router;
