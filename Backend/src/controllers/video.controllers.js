import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { Playlist } from "../models/playlist.model.js";
import { Like } from "../models/like.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
  // TODO: get all videos based on query, sort, pagination
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = 1,
    userId,
  } = req.query;

  // Define the match condition to filter videos with isPublished set to true
  const matchCondition = {
    $and: [
      {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      },
      { isPublished: true }, // Only select videos that are published
    ],
  };

  if (userId) {
    matchCondition.owner = new mongoose.Types.ObjectId(userId);
  }

  var videoAggregate;
  try {
    videoAggregate = Video.aggregate([
      {
        $match: matchCondition,
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                _id: 1,
                fullName: 1,
                avatar: "$avatar",
                username: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: {
            $first: "$owner",
          },
        },
      },
      {
        $sort: {
          [sortBy || "createdAt"]: sortType || 1,
        },
      },
    ]);
  } catch (error) {
    console.error("Error in aggregation:", error);
    throw new ApiError(
      500,
      error.message || "Internal server error in video aggregation"
    );
  }

  const options = {
    page,
    limit,
    customLabels: {
      totalDocs: "totalVideos",
      docs: "videos",
    },
    skip: (page - 1) * limit,
    limit: parseInt(limit),
  };

  Video.aggregatePaginate(videoAggregate, options)
    .then((result) => {
      if (result?.videos?.length === 0 && userId) {
        return res
          .status(200)
          .json(new ApiResponse(200, [], "No videos found"));
      }

      return res
        .status(200)
        .json(new ApiResponse(200, result, "video fetched successfully"));
    })
    .catch((error) => {
      console.log("error ::", error);
      throw new ApiError(
        500,
        error?.message || "Internal server error in video aggregate Paginate"
      );
    });
});

const getAllVideosOwner = asyncHandler(async (req, res) => {
  // TODO: get all videos based on query, sort, pagination
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = 1,
    userId,
  } = req.query;

  // Define the match condition to filter videos with isPublished set to true
  const matchCondition = {
    $and: [
      {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      },
      // { isPublished: true }, // Only select videos that are published
    ],
  };

  if (userId) {
    matchCondition.owner = new mongoose.Types.ObjectId(userId);
  }

  var videoAggregate;
  try {
    videoAggregate = Video.aggregate([
      {
        $match: matchCondition,
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                _id: 1,
                fullName: 1,
                avatar: "$avatar",
                username: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: {
            $first: "$owner",
          },
        },
      },
      {
        $sort: {
          [sortBy || "createdAt"]: sortType || 1,
        },
      },
    ]);
  } catch (error) {
    console.error("Error in aggregation:", error);
    throw new ApiError(
      500,
      error.message || "Internal server error in video aggregation"
    );
  }

  const options = {
    page,
    limit,
    customLabels: {
      totalDocs: "totalVideos",
      docs: "videos",
    },
    skip: (page - 1) * limit,
    limit: parseInt(limit),
  };

  Video.aggregatePaginate(videoAggregate, options)
    .then((result) => {
      if (result?.videos?.length === 0 && userId) {
        return res
          .status(200)
          .json(new ApiResponse(200, [], "No videos found"));
      }

      return res
        .status(200)
        .json(new ApiResponse(200, result, "video fetched successfully"));
    })
    .catch((error) => {
      console.log("error ::", error);
      throw new ApiError(
        500,
        error?.message || "Internal server error in video aggregate Paginate"
      );
    });
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // console.log("videoId", videoId);
  if (!isValidObjectId(videoId)) throw new ApiError(404, "Video not found");

  const findVideo = await Video.findById(videoId);
  if (!findVideo) throw new ApiError(404, "Video not found");

  const user = await User.findById(req.user?._id, { watchHistory: 1 });
  if (!user) throw new ApiError(404, "User not found");

  if (!user?.watchHistory.includes(videoId)) {
    await Video.findByIdAndUpdate(videoId, {
      $inc: { views: 1 },
    }, {
      new: true,
    });
  }

  await User.findByIdAndUpdate(req.user?._id, {
    $addToSet: {
      watchHistory: videoId,
    },
  }, {
    new: true,
  });

  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              title: 1,
              description: 1,
              duration: 1,
              views: 1,
              videoFile: "$videoFile.url",
              thumbnail: "$thumbnail.url",
              owner: {
                _id: "$_id",
                username: "$username",
                avatar: "$avatar",
                fullname: "$fullName",
              },
            },
          },
        ],
      },
    },
  ]);
  

  // console.log("video :: ", video[0]);
  if (!video) throw new ApiError(500, "Video detail not found");
  return res.status(200).json(new ApiResponse(200, video[0], "Fetched video successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  let videoFileUrl;
  let thumbnailUrl;
  try {
    if (!(title && description) || !(title?.trim() && description?.trim()))
      throw new ApiError(404, "Please provide title and description");

    if (!req.files?.videoFile?.[0]?.path && !req.files?.thumbnail?.[0]?.path)
      throw new ApiError(404, "Please provide video and thumbnail");
      
    const [videoFile, thumbnail] = await Promise.all([
      uploadOnCloudinary(req.files?.videoFile?.[0]?.path),
      uploadOnCloudinary(req.files?.thumbnail?.[0]?.path),
    ]);

    // Extract URL properties from the uploaded files
    videoFileUrl = videoFile?.url;
    thumbnailUrl = thumbnail?.url;

    const video = await Video.create({
      title,
      description,
      videoFile: videoFileUrl,
      thumbnail: thumbnailUrl,
      owner: req.user?._id,
      duration: videoFile?.duration,
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          ...video._doc,
          videoFile: videoFileUrl, // Only send the URL of the video file
          thumbnail: thumbnailUrl, // Only send the URL of the thumbnail
        },
        "Video Published Successfully"
      )
    );
  } catch (error) {
    // Handle error and cleanup resources
    console.error("Error while publishing video :: ", error);
    if (videoFileUrl) {
      await deleteOnCloudinary(videoFileUrl);
    }
    if (thumbnailUrl) {
      await deleteOnCloudinary(thumbnailUrl);
    }
    throw new ApiError(
      500,
      error?.message || "Server Error while uploading video"
    );
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  const thumbnailLocalPath = req.file?.path;

  if (!isValidObjectId(videoId)) 
    throw new ApiError(400, "Invalid Video Id");

  const oldVideo = await Video.findById(videoId);
  if (!oldVideo) 
    throw new ApiError(404, "No Video Found");

  if (!thumbnailLocalPath || !title?.trim() || !description?.trim()) {
    throw new ApiError(400, "Title, description, and thumbnail are required for update");
  }

  const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!uploadedThumbnail)
    throw new ApiError(500, "Thumbnail upload to Cloudinary failed");

  console.log("uploadedThumbnail ::", uploadedThumbnail);

  // let url;

  // if (oldVideo) {
  //   url = oldVideo.thumbnail;
  // }

  // if (!url)
  //   throw new ApiError(500, "Old thumbnail URL not found");

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: uploadedThumbnail.url,
      },
    },
    {
      new: true,
    }
  );

  // if (url) {
  //   try {
  //     await deleteOnCloudinary(url);
  //   } catch (error) {
  //     console.error(`Failed to delete old thumbnail from Cloudinary: ${error}`);
  //     throw new ApiError(500, "Failed to delete old thumbnail from Cloudinary");
  //   }
  // }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Updated Successfully"));
});


const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  var deleteVideoFilePromise;
  var deleteThumbnailPromise;
  try {
    // 1. Validate videoId and fetch video details (optimized query)
    const video = await Video.findById(videoId, {
      videoFile: 1,
      thumbnail: 1,
    }).select("_id videoFile thumbnail"); // Use aggregation pipeline for efficiency

    if (!video) throw new ApiError(404, "No Video Found");

    // 2. Delete video file and thumbnail from Cloudinary (concurrent calls)
    // [deleteVideoFilePromise, deleteThumbnailPromise] = await Promise.all([
    //   deleteOnCloudinary(video.videoFile.url, video.videoFile.publicId),
    //   deleteOnCloudinary(video.thumbnail.url, video.thumbnail.publicId),
    // ]);

    // 3. Delete video from database
    await Video.findByIdAndDelete(videoId);

    // 4. Remove video from related collections (optimized updates)
    const updatePromises = [
      User.updateMany(
        { watchHistory: videoId },
        { $pull: { watchHistory: videoId } }
      ),
      Comment.deleteMany({ video: videoId }),
      Playlist.updateMany({ videos: videoId }, { $pull: { videos: videoId } }),
      Like.deleteMany({ video: videoId }),
    ];

    await Promise.all(updatePromises);

    // 5. Handle any remaining tasks (e.g., removing likes)
    // ...

    return res
      .status(200)
      .json(new ApiResponse(201, {}, "Video Deleted Successfully"));
  } catch (error) {
    console.error("Error while deleting video:", error);

    // Rollback Cloudinary actions if necessary
    try {
      // if (deleteVideoFilePromise?.error) await deleteVideoFilePromise.retry(); // Attempt retry
      // if (deleteThumbnailPromise?.error) await deleteThumbnailPromise.retry();
    } catch (cloudinaryError) {
      console.error(
        "Failed to rollback Cloudinary deletions:",
        cloudinaryError
      );
    }

    throw new ApiError(
      500,
      error.message || "Server Error while deleting video"
    );
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video Id");

  const video = await Video.findById(videoId, {
    _id: 1,
    isPublished: 1,
    owner: 1,
  });
  if (!video) throw new ApiError(404, "No Video Found");

  if (video?.owner?.toString() !== req.user?._id?.toString())
    throw new ApiError(401, "Unauthorized Request");

  const toggleVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished: !video?.isPublished,
      },
    },
    {
      new: true,
    }
  );

  if (!toggleVideo)
    throw new ApiError(500, "Something went wrong while updating video");
  return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        toggleVideo,
        toggleVideo?.isPublished
          ? "Video Published Successfully"
          : "Video Unpublished Successfully"
      )
    );
});

export {
  getAllVideos,
  getAllVideosOwner,
  publishAVideo,
  updateVideo,
  deleteVideo,
  getVideoById,
  togglePublishStatus,
};
