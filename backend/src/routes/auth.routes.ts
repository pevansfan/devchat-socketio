import { Router } from "express";

import { 
    initializeConnection,
    getCurrentUser
} from "../controllers/auth.controller";

const router = Router();

router.post("/initialize", initializeConnection,);
router.get("/me", getCurrentUser)

export default router;