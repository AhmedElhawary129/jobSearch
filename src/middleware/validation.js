import { AppError, asyncHandler } from "../utils/error/index.js";

export const validation = (schema) => {
  return asyncHandler(async (req, res, next) => {
    const errorResult = [];
    for (const key of Object.keys(schema)) {
      const data = schema[key].validate(req[key], { abortEarly: false });
      if (data?.error) {
        errorResult.push(data.error.details);
      }
    }
    if (errorResult.length > 0) {
      return next(new AppError(errorResult, 400))
    }
    next();
  });
};
