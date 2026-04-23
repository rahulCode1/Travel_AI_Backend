import mongoose from "mongoose";

const initlizeDb = async () => {
  mongoose
    .connect(process.env.MONGODB)
    .then(() => console.log("Successfully connected to db."))
    .catch((err) => console.log(err));
};

export default initlizeDb;
