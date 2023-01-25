import { Router } from "express";
import projectRoutes from "./project";

const router = Router();

router.use("/project", projectRoutes);

export default router;
