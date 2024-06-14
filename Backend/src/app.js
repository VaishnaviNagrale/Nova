import express from "express" // this is used to create the server
import cors from "cors" // this is used to allow the frontend to access the backend
import cookieparser from "cookie-parser" // this is used to parse the cookies

//app decleration
const app = express()

const allowedOrigins = [process.env.CORS_ORIGIN, 'http://localhost:5173'];

//middlewares : this is a function that runs before the request is handled
app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin like mobile apps or curl requests
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true
  }));

// this is used to parse the incoming request body
app.use(express.json({
    limit: "16kb"
}))

// this urlencoded is used to parse the incoming request body
app.use(express.urlencoded({extended: true,limit: "16kb"}))
// this is used to serve the static files
app.use(express.static("public"))
// this is used to parse the cookies
app.use(cookieparser())


// import all router
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js"
import likeRouter from "./routes/like.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import { ApiResponse } from "./utils/ApiResponse.js";
import supportRouter from "./routes/support.routes.js";
import channelRouter from "./routes/channel.routes.js";



app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/support", supportRouter);
app.use("/api/v1/channel", channelRouter);


// error handler
app.use((err, req, res, next) => {
  console.log("stack error ::", err.stack);
    return res.status(err.statusCode || 500).json(
        new ApiResponse(
            err.statusCode || 500,
            null,
            err.message || "Error From Server"
        )
    );
});

export default app;