const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/response");

function auth(request, response, next) {
  const header = request.headers.authorization || "";
  const [type, token] = header.split(" ");

  console.log(type, token);

  if (type !== "Bearer" || !token) {
    return errorResponse(response, 401, "Unauthorized", {
      auth: ["Missing or invalid Authorization header"]
    });
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    request.user = { id: Number(payload.sub), email: payload.email, name: payload.name };
    return next();
  } catch (e) {
    return errorResponse(response, 401, "Unauthorized", { auth: ["Invalid or expired token"] });
  }
}

module.exports = auth;
