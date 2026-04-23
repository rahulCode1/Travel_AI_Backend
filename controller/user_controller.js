import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import User from "../model/user_model.js";
import HttpError from "../model/error_model.js";
import jwt from "jsonwebtoken";

const authGoogle = (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:${process.env.PORT}/auth/google/callback&response_type=code&scope=profile email`;

  res.redirect(googleAuthUrl);
};

const authCallback = async (req, res, next) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Authorization code not provided.");
  }

  let accessToken;

  try {
    const tokenResponse = await axios.post(
      `https://oauth2.googleapis.com/token`,
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.BACKEND_URI}/auth/google/callback`,
      },
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    accessToken = tokenResponse.data.access_token;
    const userInfoResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const googleUser = userInfoResponse.data;

    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = new User({
        name: googleUser.name,
        email: googleUser.email,
        picture: googleUser.picture,
      });

      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "30d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
    });

    return res.redirect(`${process.env.FRONTEND_URL}/v1/profile/google`);
  } catch (error) {
    next(error);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    res.json(token);
  } catch (error) {
    next(error);
  }
};

export { authGoogle, authCallback, verifyUser };
