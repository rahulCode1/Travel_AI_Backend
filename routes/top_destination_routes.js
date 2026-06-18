import express from "express";
const router = express.Router();
import authCheck from "../middleware/auth_check.js";
import {
  addTrip,
  editTrip,
  deleteTrip,
  getAllDestinations,
} from "../controller/top_destination_controller.js";
import upload from "../config/multer_config.js";

router.get("/", getAllDestinations);
router.post("/", upload.single("image"), authCheck, addTrip);

router.patch("/:tripId", authCheck, editTrip);

router.delete("/:tripId", authCheck, deleteTrip);

export default router;
