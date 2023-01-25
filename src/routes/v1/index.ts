import { Router } from "express";
import userRouter from "./user";
import adminRoutes from "./admin";
import authRoutes from "./auth";
import projectRoutes from "./project";

const router = Router();

router.use("/admin", adminRoutes);

router.use("/user", userRouter);

router.use("/auth", authRoutes);

router.use("/project", projectRoutes);

export default router;
