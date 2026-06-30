import { Router } from "express";
import { userLogin, userRegister, accesstokengenerate } from "../controllers/user.controller.js";

const router = Router();

router.route("/login").post(userLogin)

router.route("/register").post(userRegister)

router.route("/refresh-token").post(accesstokengenerate)


export default router;