import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getChannelDetails,getChannelVideos,getChannelStats } from "../controllers/channel.controllers.js";

const router = express.Router();
router.use(verifyJWT);

router.route("/:channelId").get(getChannelDetails);
router.route("/:channelId/stats").get(getChannelStats);
router.route("/:channelId/videos").get(getChannelVideos);

export default router;