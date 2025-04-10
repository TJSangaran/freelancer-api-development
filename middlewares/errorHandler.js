function errorHandler(err, req, res, next) {
  console.log(err);
  let customError = err;
  if (err instanceof Error) {
    customError = { success: false, error: "Internal Server Error" };
  }
  const statusCode =
    typeof customError?.statusCode === "number" ? customError?.statusCode : 500;
  delete customError?.statusCode;
  res.status(statusCode).json(customError);
}

module.exports = errorHandler;
