import mongoose from "mongoose";

const travelSchema = new mongoose.Schema(
  {
    destination: { type: String, required: true },
    best_time: { type: String, required: true },
    duration_days: { type: Number, required: true },
    top_attractions: { type: [String], required: true },
    sample_itinerary: [
      {
        day: { type: Number, required: true },
        plan: { type: String, required: true },
      },
    ],
    estimated_budget_eur: {
      low: { type: Number, required: true },
      mid: { type: Number, required: true },
      high: { type: Number, required: true },
    },

    stays: [
      {
        hotel_name: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        distance: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    local_tips: { type: [String], required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    isTripComplete: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Travel = mongoose.model("Travel", travelSchema);
export default Travel;
