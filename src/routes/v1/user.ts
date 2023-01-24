import { Router } from "express";
import UserController from "../../app/user/controllers/user";

const router = Router();

router.post("/create", UserController.createNewUser);

export default router;
