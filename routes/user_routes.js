import express from "express";
import {
  authCallback,
  authGoogle,
  verifyUser,
} from "../controller/user_controller.js";

const router = express.Router();

router.get("/auth/google", authGoogle);
router.get("/auth/google/callback", authCallback);
router.get("/user/me", verifyUser);

export default router;
