const asyncHandler = (func) => {
  return async (req, res, next) => {
    try {
      await func(req, res, next);
    } catch (error) {
      console.error("Error in asyncHandler:", error);

      const statusCode = error.code && Number.isInteger(error.code) && error.code >= 100 && error.code < 600
        ? error.code
        : 500;

      res.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
};

export { asyncHandler };
