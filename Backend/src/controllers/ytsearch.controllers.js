import axios from "axios";
import { redisClient } from "../utils/redis.js";

export const searchYouTube = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required",
      });
    }

    const normalizedQuery = query.trim().toLowerCase();
    const cacheKey = `yt:search:${normalizedQuery}`;

    // 1️⃣ Check cache
    try {
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        console.log(`CACHE HIT → ${cacheKey}`);
        return res.status(200).json(JSON.parse(cachedData));
      }
    } catch (redisError) {
      console.error("Redis read error:", redisError.message);
    }

    console.log(`CACHE MISS → ${cacheKey}`);

    // 2️⃣ Fetch from YouTube API
    const ytResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: normalizedQuery,
          type: "video",
          maxResults: 10,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const data = ytResponse.data;

    // 3️⃣ Cache result
    try {
      await redisClient.set(cacheKey, JSON.stringify(data), {
        EX: 600, // 10 minutes
      });
    } catch (redisError) {
      console.error("Redis write error:", redisError.message);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("YouTube search error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch YouTube search results",
    });
  }
};