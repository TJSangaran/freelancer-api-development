function errorHandler(err, req, res, next) {
  console.log(err);
  let customError = err;
  if (err instanceof Error) {
    customError = { success: false, error: err.message };
  }
  const statusCode =
    typeof customError?.statusCode === "number" ? customError?.statusCode : 400;
  delete customError?.statusCode;
  res.status(statusCode).json(customError);
}

module.exports = errorHandler;
