import { Router } from "express";
import projectRoutes from "./project";
import transactionRoute from "./transaction";

const router = Router();

router.use("/project", projectRoutes);

router.use("/transaction", transactionRoute);

export default router;
