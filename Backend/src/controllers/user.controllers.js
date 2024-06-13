import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  // validation - not empty
  if (!fullName) {
    throw new ApiError(400, "Fullname is required");
  }
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  if (!username) {
    throw new ApiError(400, "Username is required");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  // check if user already exists: username, email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // check for images and avatar
  const avatarLocalPath = req.files?.avatar[0].path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // upload files to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  // create user object - create entry in db
  const user = new User({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // Generate refresh token
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;

  await user.save();

  // remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully!!"));
});

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, `Error generating tokens: ${error.message}`);
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // find user
  // delete user cookies
  try {
    // if (!req.user || !req.user._id) {
    //     throw new ApiError(401, "Unauthorized request");
    //   }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      }
    );
    //console.log(user)
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged Out Successfully"));
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json(new ApiResponse(500, {}, "Logout failed"));
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: user,
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!(oldPassword || newPassword))
    throw new ApiError(400, "Invalid oldPassword or newPassword");

  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(404, "User Not Found");

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) throw new ApiError(401, "Wrong password entered");

  user.password = newPassword;
  await user.save({ validityBeforeSave: false });
  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "User Password has been changed Successfully")
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  // console.log("req.user", req.user);
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User profile received successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  console.log("fullName", fullName);
  console.log("email", email);
  if (!(fullName || email))
    throw new ApiError(400, "All  fields are required!");
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    {
      new: true, // updated response return
    }
  ).select("-password");
  if (!user) throw new ApiError(404, "User not found!");
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
      },
      "updated Successfully"
    )
  );
});
// better approach to upload file is to make a seperate endpoint and seperate controller which lowers network consegation
// updating file

const updateUserAvatarImage = asyncHandler(async (req, res) => {
  // Validate existing avatar URL
  const { url } = req.user?.avatar || {};
  if (!url) {
    throw new ApiError(404, "Current avatar URL not found");
  }

  // Validate uploaded avatar file
  const avatarImageLocalPath = req.file?.path;
  if (!avatarImageLocalPath) {
    throw new ApiError(400, "Please select an image to upload");
  }

  // Upload new avatar to Cloudinary
  const avatar = await uploadOnCloudinary(avatarImageLocalPath);
  if (!avatar?.url) {
    throw new ApiError(500, "Server Error while uploading image on Cloudinary");
  }

  // Update user avatar in the database
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { avatar: avatar?.secure_url || avatar?.url },
    { new: true }
  ).select("-password");

  // Handle user not found
  if (!user) {
    await deleteOnCloudinary(avatar?.url); // Rollback upload if user not found
    throw new ApiError(404, "User not found");
  }

  // Delete the old avatar from Cloudinary
  if (url) {
    try {
      await deleteOnCloudinary(url);
    } catch (error) {
      console.log(`Failed to delete old image from Cloudinary: ${error}`);
      throw new ApiError(500, `Failed to delete old image: ${error.message}`);
    }
  }

  console.log("Avatar deleted and updated successfully");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  // Validate existing cover image URL
  const { publicId, url } = req.user?.coverImage || {};
  if (!url) {
    throw new ApiError(404, "Current cover image URL not found");
  }

  // Validate uploaded cover image file
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "No cover image provided");
  }

  // Upload new cover image to Cloudinary
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage?.url) {
    throw new ApiError(500, "Server error while uploading cover image");
  }

  // Update user cover image in the database
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { coverImage: coverImage?.secure_url || coverImage?.url },
    { new: true }
  ).select("-password");

  // Handle user not found
  if (!user) {
    await deleteOnCloudinary(coverImage?.url, coverImage?.public_id); // Rollback upload if user not found
    throw new ApiError(404, "User not found");
  }

  // Delete the old cover image from Cloudinary
  if (url) {
    try {
      await deleteOnCloudinary(url, publicId);
    } catch (error) {
      console.log(`Failed to delete old image from Cloudinary: ${error}`);
      throw new ApiError(500, `Failed to delete old image: ${error.message}`);
    }
  }

  console.log("Cover image deleted and updated successfully");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  // console.log(username)
  if (!username?.trim()) throw new ApiError(404, "User or channel not found");
  const channel = await User.aggregate([
    {
      $match: {
        username: username.toLowerCase(),
      },
    },
    // stage 2 : get subscriber count

    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    // stage 3 : get subscrib by channel
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    // stage  4 : add isSubscribe field to each document in the array
    {
      $addFields: {
        subscriberCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribe: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    // stage 4 : get thr projections data which we want to send from this document;
    {
      $project: {
        fullName: 1,
        username: 1,
        email: 1,
        isSubscribe: 1,
        subscriberCount: 1,
        channelsSubscribedToCount: 1,
        avatar: "$avatar.url",
        coverImage: "$coverImage.url",
      },
    },
  ]);

  // console.log("channel :: ", channel);
  if (!channel?.length) throw new ApiError("404", "channel doesn't exist");
  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "Channel fetched Successfully"));
});

const getUserWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.user?._id),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchHistory",
          pipeline: [
            {
              $match: {
                deleted: { // Corrected field name to 'deleted'
                  $ne: true,
                },
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
                videoFile: "$videoFile",
                thumbnail: "$thumbnail",
              },
            },
          ],
        },
      },
      {
        $sort: {
          watchedAt: -1,
        },
      },
    ]);
  
    if (!user?.length) throw new ApiError(404, "Watch History is empty");
  
    return res.status(200).json(new ApiResponse(200, user[0].watchHistory, "success"));
  });
  

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatarImage,
  updateUserCoverImage,
  getUserChannelProfile,
  getUserWatchHistory,
};
