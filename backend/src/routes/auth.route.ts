import express from "express";
import { signup, login,logout } from "../controllers/auth.controller.js";

import { sign } from "jsonwebtoken";

const router = express.Router();

router.use(express.json());

router.post('/login', login);

router.post("/signup", signup);

router.get('/logout', logout);

export default router;