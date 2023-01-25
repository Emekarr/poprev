import { Router } from "express";
import AuthController from "../../app/auth/controller/authController";

const router = Router();

router.post("/login", AuthController.loginAdmin);

export default router;
