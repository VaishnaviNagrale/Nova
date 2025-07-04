import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        //console.log(req.cookies?.accessToken)
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        //console.log(token);
        if (!token || typeof token !== 'string') {
            throw new ApiError(401, "Unauthorized request: Invalid token");
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        //console.log("pofjepf",decodedToken)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})