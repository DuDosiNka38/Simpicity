function successResponse(res, status, data, message) {
  return res.status(status).json({
    success: true,
    data,
    message: message || null
  });
}

function errorResponse(res, status, error, errors) {
  const payload = {
    success: false,
    error: error || "Error"
  };
  if (errors) payload.errors = errors;
  return res.status(status).json(payload);
}



module.exports = { successResponse, errorResponse };