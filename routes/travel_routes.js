import express from "express";
import {
  createTrip,
  saveTrips,
  getAllSavedTrips,
  tripDetails,
  deleteTrip,
  updateTrip,
  saveUpdatedTrip,
  markTripAsComplete,
} from "../controller/travel_controller.js";
import auth_check from "../middleware/auth_check.js";

import {
  createTripValidation,
  saveTripValidation,
  tripIdValidation,
} from "../middleware/express_validation.js";

const router = express.Router();


router.post("/travel-planner", createTripValidation, createTrip);
router.post("/update-trip/:tripId", tripIdValidation, auth_check, updateTrip);
router.get("/saved-trip", auth_check, getAllSavedTrips);
router.get("/:tripId/trip-details", tripIdValidation, auth_check, tripDetails);
router.post("/save-trip", saveTripValidation, auth_check, saveTrips);
router.patch(
  "/save-updated-trip/:tripId",
  tripIdValidation,
  auth_check,
  saveUpdatedTrip,
);
router.patch(
  "/:tripId/mark-complete",
  tripIdValidation,
  auth_check,
  markTripAsComplete,
);


router.delete("/:tripId", tripIdValidation, auth_check, deleteTrip);

export default router;
