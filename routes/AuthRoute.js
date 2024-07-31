import express from "express";
import { Login, Me, logOut } from "../controller/Auth.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/me", Me);
router.post("/login", Login );
router.delete("/logout", logOut);

export default router;