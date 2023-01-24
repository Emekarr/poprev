import { Router } from "express";
import UserController from "../../app/user/controllers/user";

const router = Router();

router.post("/create", UserController.createNewUser);

router.post("/verify", UserController.verifyUserAccount);

export default router;
