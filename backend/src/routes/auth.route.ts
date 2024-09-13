import express from "express";
import { signup, login, logout, getMe } from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";

import { sign } from "jsonwebtoken";

const router = express.Router();

// router.use(express.json());

router.post('/login', login);

router.post("/signup", signup);

router.get('/logout', logout);

router.get('/me',protectRoute, getMe);

export default router;