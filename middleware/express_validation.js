import { check, param, query } from "express-validator";

const createTripValidation = [
  check("destination").trim().notEmpty().withMessage("Destination required"),
  check("duration")
    .notEmpty()
    .withMessage("Duration required.")
    .isInt({ min: 1 })
    .withMessage("Minimum duration 1 day."),

  check("budget")
    .notEmpty()
    .withMessage("Budget required.")
    .isFloat({ min: 1 })
    .withMessage("Minimum budget is 1."),
];

const tripIdValidation = [
  param("tripId")
    .notEmpty()
    .withMessage("Trip id required.")
    .isMongoId()
    .withMessage("Trip id must be mongoose id."),
];

const saveTripValidation = [
  // Destination
  check("destination").trim().notEmpty().withMessage("Destination required"),
  // Best time
  check("best_time").trim().notEmpty().withMessage("best time required"),
  // Top attraction
  check("top_attractions")
    .isArray({ min: 1 })
    .withMessage("At least one attraction is required."),
  check("top_attractions.*")
    .trim()
    .notEmpty()
    .withMessage("Top  attraction  required."),
  // Sample itinerary
  check("sample_itinerary")
    .isArray({ min: 1 })
    .withMessage("At least one sample itinerary required"),

  check("sample_itinerary.*.plan")
    .trim()
    .notEmpty()
    .withMessage("Plan required in sample itinerary"),

  check("sample_itinerary.*.day")
    .isInt({ min: 1 })
    .withMessage("Day must be at least 1"),

  // Duration days
  check("duration_days")
    .notEmpty()
    .withMessage("Duration required.")
    .isInt({ min: 1 })
    .withMessage("Minimum duration 1 day."),

  // Estimated budget
  // Low
  check("estimated_budget.low")
    .notEmpty()
    .withMessage("Low budget required.")
    .isFloat({ min: 1 })
    .withMessage("Minimum low budget is 1."),
  // Mid
  check("estimated_budget.mid")
    .notEmpty()
    .withMessage("Mid budget required.")
    .isFloat({ min: 1 })
    .withMessage("Medium low budget is 1."),
  // High
  check("estimated_budget.high")
    .notEmpty()
    .withMessage("High budget required.")
    .isFloat({ min: 1 })
    .withMessage("High low budget is 1."),

  // Currency value
  check("currency_value")
    .trim()
    .notEmpty()
    .withMessage("currency value required"),
  // Currency symbol
  check("currency_symbol")
    .trim()
    .notEmpty()
    .withMessage("currency symbol required"),

  // Stays
  check("stays").isArray({ min: 1 }).withMessage("At least 1 stay required."),
  check("stays.*.hotel_name")
    .trim()
    .notEmpty()
    .withMessage("Hotel name required."),
  check("stays.*.rating")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 to 5"),
  check("stays.*.distance")
    .isFloat({ min: 0 })
    .withMessage("Distance must be valid"),
  check("stays.*.price")
    .isFloat({ min: 1 })
    .withMessage("Minimum price 1 eur / night"),

  // Local tips
  check("local_tips")
    .isArray({ min: 1 })
    .withMessage("Minimum 1 local tips required."),
  check("local_tips.*").trim().notEmpty().withMessage("Local tips required"),
];

export { createTripValidation, tripIdValidation, saveTripValidation };
