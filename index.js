import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import initlizeDb from "./db/db.connect.js";
import travelRoutes from "./routes/travel_routes.js";
import authRoutes from "./routes/user_routes.js";
import HttpError from "./model/error_model.js";

const app = express();

initlizeDb();

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization",
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
//   next();
// });

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // ✅ ADD THIS
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use(authRoutes);
app.use("/api", travelRoutes);

app.use((req, res, next) => {
  return next(new HttpError("Route not found.", 404));
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res
    .status(error.statusCode || 500)
    .json({ message: error?.message || "Something went wrong." });
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
