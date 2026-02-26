const express = require("express");
const cors = require("cors");

const { errorResponse } = require("./utils/response");

const authRoutes = require("./routes/auth");
const announcementsRoutes = require("./routes/announcements");
const categoriesRoutes = require("./routes/categories");

const app = express();


app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/announcements", announcementsRoutes);
app.use("/api/categories", categoriesRoutes);


app.use((req, res) => {
  return res.status(404).json({
    success: false,
    error: "Not Found",
    errors: { route: ["Route does not exist"] }
  });
});


app.use((err, req, res, next) => {
  console.error(err);

  if (err && err.name === "ZodError") {
    const formatted = {};
    for (const issue of err.issues || []) {
      const key = issue.path?.join(".") || "error";
      if (!formatted[key]) formatted[key] = [];
      formatted[key].push(issue.message);
    }
    return errorResponse(res, 400, "Validation failed", formatted);
  }

  return errorResponse(res, 500, "Internal Server Error");
});

module.exports = app;
