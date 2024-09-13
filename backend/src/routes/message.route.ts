import express from "express"
import protectRoute from "../middleware/protectRoute.js";
import { getMessage, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";
const router = express.Router();

router.post('/send/:id', protectRoute, sendMessage );
router.get('/conversations', protectRoute, getUsersForSidebar);
router.get('/:id', protectRoute, getMessage);

export default router;