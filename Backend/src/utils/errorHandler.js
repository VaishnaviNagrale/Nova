import logger from "./logger.js";
import { ApiError } from "./ApiError.js";
import { ApiResponse } from "./ApiResponse.js";

const errorHandler = (err, req, res, next) => {

  if (err instanceof ApiError) {

    logger.warn({
      message: err.message,
      statusCode: err.statusCode,
      path: req.originalUrl,
      method: req.method
    });

    return res.status(err.statusCode).json(
      new ApiResponse(err.statusCode, null, err.message)
    );
  }

  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.originalUrl
  });

  return res.status(500).json(
    new ApiResponse(500, null, "Internal Server Error")
  );
};

export { errorHandler };