import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { mongoose } from "mongoose";

const getChannelDetails = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) throw new ApiError(404, "Channel ID is required");
  
  const channelDetails = await User.findById(channelId).select("-password -refreshToken");
  if (!channelDetails) throw new ApiError(404, "Channel not found");
  
  return res
    .status(200)
    .json(new ApiResponse(200, channelDetails, "Channel details fetched successfully"));
});

const getChannelStats = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) throw new ApiError(404, "Channel ID is required");

  try {
    const channelStats = await Video.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
      {
        $lookup: {
          from: "subscriptions",
          localField: "owner",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "owner",
          foreignField: "subscriber",
          as: "subscribedTo",
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "video",
          as: "likedVideos",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "video",
          as: "videoComments",
        },
      },
      {
        $lookup: {
          from: "tweets",
          localField: "owner",
          foreignField: "owner",
          as: "tweets",
        },
      },
      {
        $group: {
          _id: null,
          totalVideos: { $sum: 1 },
          totalViews: { $sum: "$views" },
          subscribers: { $first: "$subscribers" },
          subscribedTo: { $first: "$subscribedTo" },
          totalLikes: { $sum: { $size: "$likedVideos" } },
          totalComments: { $sum: { $size: "$videoComments" } },
          totalTweets: { $first: { $size: "$tweets" } },
        },
      },
      {
        $project: {
          _id: 0,
          totalVideos: 1,
          totalViews: 1,
          subscribers: { $size: "$subscribers" },
          subscribedTo: { $size: "$subscribedTo" },
          totalLikes: 1,
          totalComments: 1,
          totalTweets: 1,
        },
      },
    ]);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          channelStats[0],
          "Channel stats fetched successfully"
        )
      );
  } catch (err) {
    console.error("Error in getChannelStats:", err);
    res.status(500).json(new ApiResponse(500, null, err.message));
  }
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) throw new ApiError(404, "Channel ID is required");

  const videoPipeline = [
    { 
      $match: { 
        owner: new mongoose.Types.ObjectId(channelId),
        isPublished: true // Add condition to filter by isPublished
      } 
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          { $project: { fullName: 1, username: 1, avatar: 1, coverImage: 1, email: 1 } },
        ],
      },
    },
    { $unwind: "$owner" },
    { $addFields: { videoFile: "$videoFile", thumbnail: "$thumbnail" } },
  ];

  try {
    const allVideos = await Video.aggregate(videoPipeline);
    return res
      .status(200)
      .json(new ApiResponse(200, allVideos, "Videos fetched successfully"));
  } catch (error) {
    console.error("Error while fetching videos:", error);
    throw new ApiError(500, "Server error while fetching videos");
  }
});


export { getChannelDetails, getChannelStats, getChannelVideos };