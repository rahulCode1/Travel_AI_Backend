dotenv.config();
import dotenv from "dotenv";
import OpenAI from "openai";
import Travel from "../model/travel_model.js";
import HttpError from "../model/error_model.js";
import { SYSTEM_PROMPT, SYSTEM_PROMPT_FOR_UPDATE } from "../utils/data.js";
import { validationResult } from "express-validator";

const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "deepseek/deepseek-v3.2";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: API_KEY,
});

const createTrip = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new HttpError(errors.array()[0].msg, 400));
    }

    const { destination, duration, budget } = req.body;

    const USER_PROMPT = `
Create a short travel plan for a first-time visitor.

Destination: ${destination}
Duration: ${duration} days
Budget for entire trip: ${Number(budget)}

Focus on:
- Must-see attractions
- A logical day-by-day itinerary
- Beginner-friendly experiences
- Balanced pace (not too rushed)
- Trip be realistic according budget (Budget match to trip)

Ensure the plan is realistic for the given number of days.
`;

    const sdkRes = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: USER_PROMPT,
        },
      ],
    });

    const data = JSON.parse(sdkRes?.choices?.[0]?.message?.content);

   

    res.json({
      success: true,
      message: "Trip plan created successfully.",
      trip: data,
    });
  } catch (error) {
    next(error);
  }
};

const saveTrips = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0]?.msg, 400));
  }

  console.log("Trip for save:", req.body)

  try {
    const userId = req.userId;

    const trip = new Travel({ ...req.body, userId });
    await trip.save();

    res.json({
      success: true,
      message: "Trip saved successfully.",
      savedTrip: trip.toObject({ getters: true }),
    });
  } catch (error) {
    next(error);
  }
};

const getAllSavedTrips = async (req, res, next) => {
  try {
    const userId = req.userId;
    const myTrips = await Travel.find({ userId }).sort({ createdAt: -1 });

    res.status(201).json({
      success: true,
      message: "Saved trips find successfully.",
      savedTrips: myTrips.map((trip) => trip.toObject({ getters: true })),
    });
  } catch (error) {
    next(error);
  }
};

const tripDetails = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0]?.msg));
  }

  try {
    const tripId = req.params.tripId;

    const tripDetails = await Travel.findById(tripId);

    res.status(201).json({
      success: true,
      message: "Saved trips find successfully.",
      trip: tripDetails.toObject({ getters: true }),
    });
  } catch (error) {
    next(error);
  }
};

const deleteTrip = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0]?.msg));
  }

  const tripId = req.params.tripId;

  try {
    const deleteTrip = await Travel.findByIdAndDelete(tripId);

    if (!deleteTrip) {
      return next("Failed to delete trip", 404);
    }

    res.status(201).json({
      success: true,
      message: "Trip deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateTrip = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0]?.msg));
  }

  const { destination, duration, budget } = req.body;

  const tripId = req.params.tripId;

  try {
    const travelPlan = await Travel.findById(tripId);

    if (!travelPlan) {
      return next(new HttpError("No trip find for that id.", 404));
    }

    const USER_PROMPT = `
Here is an existing travel plan in JSON:
${travelPlan}

Update this plan based on the following user changes:
- New destination: ${destination}
- New duration (days): ${duration}
- New budget (EUR): ${budget}

Update rules:
- Modify ONLY what is necessary to reflect the new inputs
- Preserve all unchanged fields exactly as they are
- Keep structure, formatting, and schema EXACTLY the same

- If destination changes, regenerate all location-specific fields
- If only duration changes, update only duration_days and sample_itinerary
- If only budget changes, update only estimated_budget_eur and stays pricing

- Ensure all values remain realistic and consistent
- Ensure estimated_budget_eur aligns with the new budget
- Maintain at least 3 days in sample_itinerary

Return ONLY valid JSON.
`;

    const sdkRes = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT_FOR_UPDATE,
        },
        {
          role: "user",
          content: USER_PROMPT,
        },
      ],
    });

    const data = JSON.parse(sdkRes?.choices?.[0]?.message?.content);

    res.status(201).json({
      success: true,
      message: "Trip generate successfully.",
      updatedTrip: data,
    });
  } catch (error) {
    next(error);
  }
};

const saveUpdatedTrip = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0]?.msg));
  }

  try {
    const userId = req.userId;
    const tripId = req.params.tripId;
    const tripData = req.body;

    const existingTrip = await Travel.findById(tripId);

    if (!existingTrip) {
      return next(new HttpError("No trip found with that id.", 404));
    }

    if (existingTrip.userId.toString() !== userId) {
      return next(
        new HttpError("You're not allowed to update this trip.", 403),
      );
    }

    const updatedTrip = await Travel.findByIdAndUpdate(tripId, tripData, {
      returnDocument: "after",
    });

    res.json({
      success: true,
      message: "Trip saved successfully.",
      updatedTrip: updatedTrip.toObject({ getters: true }),
    });
  } catch (error) {
    next(error);
  }
};

const markTripAsComplete = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0]?.msg));
  }

  try {
    const { tripId } = req.params;
    const userId = req.userId;

    const trip = await Travel.findById(tripId);

    if (!trip) {
      return next(new HttpError("Trip not found with that id.", 404));
    }

    if (trip.userId.toString() !== userId) {
      return next(
        new HttpError("You're not allow to update trip status.", 403),
      );
    }

    trip.isTripComplete = true;
    await trip.save();

    res.status(200).json({
      success: true,
      message: "Trip status updated to complete",
    });
  } catch (error) {
    next(error);
  }
};

export {
  createTrip,
  saveTrips,
  getAllSavedTrips,
  tripDetails,
  deleteTrip,
  updateTrip,
  saveUpdatedTrip,
  markTripAsComplete,
};
