import { Router } from "express";
import {searchYouTube} from "../controllers/ytsearch.controllers.js"
import {verifyJWT} from "../middlewares/auth.middleware.js" 

const router = Router();
router.use(verifyJWT); // every routes will be protected

router.route("/search").get(searchYouTube);

export default router;