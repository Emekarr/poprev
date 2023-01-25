import { Router } from "express";
import userRouter from "./user";
import adminRoutes from "./admin";
import authRoutes from "./auth";

const router = Router();

router.use("/admin", adminRoutes);

router.use("/user", userRouter);

router.use("/auth", authRoutes);

export default router;
