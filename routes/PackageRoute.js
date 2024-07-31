import express from "express";
import { getPackage, getPackageById, createPackage, updatePackage, deletePackage } from "../controller/Package.js";
import { adminOnly, verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/getPackages", verifyUser, getPackage);
router.get("/getPackage/:id", getPackageById);
router.post("/createPackage", verifyUser, adminOnly, createPackage);
router.patch("/updatePackage/:id", verifyUser, adminOnly, updatePackage);
router.delete("/deletePackage/:id", verifyUser, adminOnly, deletePackage);

export default router