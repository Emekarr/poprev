import { Router } from "express";
import TransactionController from "../../../app/transaction/controller/transaction";
import AuthMiddleware from "../../../middleware/auth";

const router = Router();

router.get(
  "/fetch",
  AuthMiddleware(false),
  TransactionController.fetchTokenTransaction
);

export default router;
