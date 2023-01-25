import { Router } from "express";
import ProjectController from "../../../app/project/controller/projectController";
import AuthMiddleware from "../../../middleware/auth";

const router = Router();

router.post(
  "/create",
  AuthMiddleware(true),
  ProjectController.createNewProject
);

router.get("/fetch", AuthMiddleware(true), ProjectController.fetchProjects);

export default router;
