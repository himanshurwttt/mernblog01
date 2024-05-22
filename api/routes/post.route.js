import express from "express";
import {
  createPost,
  deletepost,
  getPosts,
  updatepost,
} from "../controllers/post.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyUser, createPost);
router.get("/getposts", getPosts);
router.delete("/deletepost/:postId/:userId", verifyUser, deletepost);
router.put("/updatepost/:postId/:userId", verifyUser, updatepost);

export default router;
