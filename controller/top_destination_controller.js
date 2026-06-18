import TopDestination from "../model/top_destination_model.js";
import HttpError from "../model/error_model.js";
import cloudinary from "../config/cloudinary_config.js";

const addTrip = async (req, res, next) => {
  try {
    const { destination, budget, days } = req.body;

    const file = req.file;

    if (!file) {
      return next(new HttpError("File not found.", 404));
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "uploads",
    });

    const trip = await TopDestination.create({
      destination,
      budget,
      days,
      imageUrl: result.secure_url,
      public_id: result.public_id,
      createdBy: req.userId,
    });

    res.status(201).json({
      message: "Trip created successfully",
      trip,
    });
  } catch (err) {
    next(err);
  }
};

const getAllDestinations = async (req, res, next) => {
  try {
    const destinations = await TopDestination.find().sort({ createdAt: -1 });

    res.status(200).json({
      destinations: destinations.map((dest) =>
        dest.toObject({ getters: true }),
      ),
    });
  } catch (err) {
    next(err);
  }
};

const editTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { destination, budget, days } = req.body;

    const trip = await TopDestination.findById(tripId);

    if (!trip) {
      return next(new HttpError("Trip not found", 404));
    }

    if (trip.createdBy.toString() !== req.userId) {
      return next(new HttpError("Not authorized", 403));
    }

    trip.destination = destination ?? trip.destination;
    trip.budget = budget ?? trip.budget;
    trip.days = days ?? trip.days;

    await trip.save();

    res.status(200).json({
      message: "Trip updated successfully",
      trip,
    });
  } catch (err) {
    next(err);
  }
};

const deleteTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    const trip = await TopDestination.findById(tripId);

    if (!trip) {
      return next(new HttpError("Trip not found", 404));
    }

    if (trip.createdBy.toString() !== req.userId) {
      return next(new HttpError("Unauthorized", 403));
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(trip.public_id);

    await TopDestination.findByIdAndDelete(tripId);

    res.status(200).json({
      message: "Trip deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export { addTrip, editTrip, deleteTrip, getAllDestinations };
