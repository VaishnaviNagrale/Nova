import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getUserWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatarImage, updateUserCoverImage } from "../controllers/user.controllers.js";
import { upload } from './../middlewares/multer.middleware.js';
import { verifyJWT } from './../middlewares/auth.middleware.js';
import rateLimit from "express-rate-limit";
const router = Router();

const createLimiter = (maxRequests) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
    status: 429,
    message: "Too many attempts. Please try again later."
  }
  });

router.route("/register").post(
    createLimiter(10),
    upload.fields([{
    name: "avatar",
    maxCount: 1,
}, {
    name: "coverImage",
    maxCount: 1,
        }]), registerUser);
router.route("/login").post(createLimiter(5),loginUser);
router.route("/refresh-token").post(refreshAccessToken);
// router.route("/allUser").get(getAllUser);

// secure routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.patch("/avatar", verifyJWT, upload.single("avatar"), updateUserAvatarImage);
router.patch("/cover-image", verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT,getUserWatchHistory)

export default router;
