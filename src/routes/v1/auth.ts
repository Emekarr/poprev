import { Router } from "express";
import AuthController from "../../app/auth/controller/authController";

const router = Router();

router.post("/admin/login", AuthController.loginAdmin);

router.post("/user/login", AuthController.loginUser);

export default router;
