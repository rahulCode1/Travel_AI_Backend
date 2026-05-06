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

app.use(cors());
const allowedOrigins = ["http://localhost:3000", process.env.FRONTEND_URL];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeaders("Access-Control-Allow-Origin", origin);
  }

  res.setHeaders(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  res.setHeaders(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE OPTIONS",
  );
  next();
});



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
