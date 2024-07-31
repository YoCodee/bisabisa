import express from "express";
import { createPost, getPosts, getPostById, updatePost, deletePost } from "../controller/Post.js";
import { adminOnly, verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/posts/getAll", getPosts);
router.get("/post/:id", getPostById);
router.post("/post", verifyUser, adminOnly, createPost);
router.patch("/updatepost/:id", verifyUser,adminOnly, updatePost);
router.delete("/deletePost/:id",verifyUser,adminOnly ,deletePost);

export default router;