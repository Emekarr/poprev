import { Router } from "express";
import userRouter from "./user";
import adminRoutes from "./admin";

const router = Router();

router.use("/admin", adminRoutes);

router.use("/user", userRouter);

export default router;
